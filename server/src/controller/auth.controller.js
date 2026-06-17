import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "../model/admin.model.js";
import { Faculty } from "../model/faculty.model.js";
import { Student } from "../model/student.model.js";
import { User } from "../model/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import { sendVerificationOtp } from "../utils/sendEmail.js";
import { config_ENV } from "../config/auth.config.js";

// Helper to generate 6-digit numeric OTP
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper to find user by email across all relevant schemas
const findUserByEmail = async (email) => {
    // 1. Check Admin
    let user = await Admin.findOne({ email }).select("+password +verifyOtp +verifyOtpExpire");
    if (user) return { user, role: "admin" };

    // 2. Check Faculty
    user = await Faculty.findOne({ email }).select("+password +verifyOtp +verifyOtpExpire");
    if (user) return { user, role: "faculty" };

    // 3. Check Student
    user = await Student.findOne({ email }).select("+password +verifyOtp +verifyOtpExpire");
    if (user) return { user, role: "student" };

    // 4. Check User
    user = await User.findOne({ email }).select("+password");
    if (user) return { user, role: user.role || "user" };

    return null;
};

// Send Token and set HTTP-only cookies
const sendTokenResponse = async (user, statusCode, res) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save last login time if schema supports it
    if (user.role === "admin" || user.role === "faculty") {
        user.lastLogin = new Date();
        await user.save();
    }

    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        secure: config_ENV.NODE_ENV === "production",
        sameSite: "strict"
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.cookie("accessToken", accessToken, { ...cookieOptions, expires: new Date(Date.now() + 15 * 60 * 1000) }); // 15 mins

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.verifyOtp;
    delete userObj.verifyOtpExpire;

    res.status(statusCode).json({
        success: true,
        accessToken,
        refreshToken,
        user: userObj
    });
};

/**
 * Login handler for all roles
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        const result = await findUserByEmail(email);

        if (!result) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const { user } = result;

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        await sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * OTP Verification Handler
 */
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp, role } = req.body;

        if (!email || !otp || !role) {
            return res.status(400).json({
                success: false,
                message: "Please provide email, OTP and role"
            });
        }

        let Model;
        if (role === "admin") Model = Admin;
        else if (role === "faculty") Model = Faculty;
        else if (role === "student") Model = Student;
        else {
            return res.status(400).json({
                success: false,
                message: "OTP verification only supported for student, faculty, and admin roles"
            });
        }

        const user = await Model.findOne({ email }).select("+verifyOtp +verifyOtpExpire");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "User is already verified"
            });
        }

        if (user.verifyOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        if (new Date() > user.verifyOtpExpire) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired"
            });
        }

        user.isVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpire = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Resend OTP Handler
 */
export const resendOtp = async (req, res) => {
    try {
        const { email, role } = req.body;

        if (!email || !role) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and role"
            });
        }

        let Model;
        if (role === "admin") Model = Admin;
        else if (role === "faculty") Model = Faculty;
        else if (role === "student") Model = Student;
        else {
            return res.status(400).json({
                success: false,
                message: "OTP resending only supported for student, faculty, and admin roles"
            });
        }

        const user = await Model.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "User is already verified"
            });
        }

        const otp = generateOTP();
        const otpExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        user.verifyOtp = otp;
        user.verifyOtpExpire = otpExpire;
        await user.save();

        await sendVerificationOtp(email, otp);

        res.status(200).json({
            success: true,
            message: "OTP resent successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Refresh Access Token Handler
 */
export const refreshToken = async (req, res) => {
    try {
        let refreshTok = req.cookies.refreshToken || req.body.refreshToken;

        if (!refreshTok) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is missing"
            });
        }

        const decoded = jwt.verify(refreshTok, config_ENV.REFRESH_TOKEN_SECRET);

        let user;
        if (decoded.role === "student") {
            user = await Student.findById(decoded.id);
        } else if (decoded.role === "faculty") {
            user = await Faculty.findById(decoded.id);
        } else if (decoded.role === "admin") {
            user = await Admin.findById(decoded.id);
        } else {
            user = await User.findById(decoded.id);
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User belonging to this token no longer exists"
            });
        }

        const newAccessToken = generateAccessToken(user);

        const cookieOptions = {
            expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
            httpOnly: true,
            secure: config_ENV.NODE_ENV === "production",
            sameSite: "strict"
        };
        res.cookie("accessToken", newAccessToken, cookieOptions);

        res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token",
            error: error.message
        });
    }
};

/**
 * Logout Handler
 */
export const logout = async (req, res) => {
    try {
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
