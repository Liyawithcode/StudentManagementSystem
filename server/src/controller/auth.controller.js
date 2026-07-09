import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import https from "https";
import { Admin } from "../model/admin.model.js";
import { Faculty } from "../model/faculty.model.js";
import { Student } from "../model/student.model.js";
import { User } from "../model/user.model.js";
import { config_ENV, generateAccessToken, generateRefreshToken } from "../config/auth.config.js";
import { sendVerificationOtp, sendPasswordResetOtp, generateOTP, generateAdminId, generateFacultyId, generateStudentId } from "../utils/index.js";


// Helper to find user by email across all relevant schemas
const findUserByEmail = async (email, requestedRole) => {
    // If a requestedRole is specified, try to find in that role's collection first!
    if (requestedRole === "admin") {
        const user = await Admin.findOne({ email }).select("+password +verifyOtp +verifyOtpExpire +isVerified");
        if (user) return { user, role: "admin" };
    } else if (requestedRole === "faculty") {
        const user = await Faculty.findOne({ email }).select("+password +verifyOtp +verifyOtpExpire +isVerified");
        if (user) return { user, role: "faculty" };
    } else if (requestedRole === "student") {
        const user = await Student.findOne({ email }).select("+password +verifyOtp +verifyOtpExpire +isVerified");
        if (user) return { user, role: "student" };
    }

    // Fallback search order if not found in the requested role
    let user = await Admin.findOne({ email }).select("+password +verifyOtp +verifyOtpExpire +isVerified");
    if (user) return { user, role: "admin" };

    user = await Faculty.findOne({ email }).select("+password +verifyOtp +verifyOtpExpire +isVerified");
    if (user) return { user, role: "faculty" };

    user = await Student.findOne({ email }).select("+password +verifyOtp +verifyOtpExpire +isVerified");
    if (user) return { user, role: "student" };

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

        const otp = generateOTP();
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins (aligned with email template)

        user.verifyOtp = otp;
        user.verifyOtpExpire = otpExpire;
        await user.save();

        await sendVerificationOtp(email, otp, user.adminfullname || user.username || (user.firstName ? `${user.firstName} ${user.lastName}`.trim() : "User"));

        res.status(200).json({
            success: true,
            requiresOtp: true,
            email,
            role: result.role,
            message: "Verification OTP sent to your email"
        });
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
        if (!user.role) {
            user.role = role;
        }
        await user.save();

        await sendTokenResponse(user, 200, res);
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

        const otp = generateOTP();
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes (aligned with email template)

        user.verifyOtp = otp;
        user.verifyOtpExpire = otpExpire;
        await user.save();

        const userName = user.adminfullname || user.username || (user.firstName ? `${user.firstName} ${user.lastName}`.trim() : "User");
        await sendVerificationOtp(email, otp, userName);

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

// Cache for Google's public certificates to avoid fetching them on every request
let googlePublicKeysCache = null;
let cacheExpiry = 0;

const fetchGooglePublicKeys = () => {
    return new Promise((resolve, reject) => {
        if (googlePublicKeysCache && Date.now() < cacheExpiry) {
            return resolve(googlePublicKeysCache);
        }

        https.get("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com", (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                try {
                    const keys = JSON.parse(data);
                    googlePublicKeysCache = keys;
                    cacheExpiry = Date.now() + 6 * 3600 * 1000; // Cache for 6 hours
                    resolve(keys);
                } catch (e) {
                    reject(new Error("Failed to parse Google public keys"));
                }
            });
        }).on("error", (err) => {
            reject(err);
        });
    });
};

export const verifyFirebaseIdToken = async (idToken) => {
    if (!idToken) {
        throw new Error("No ID token provided");
    }

    const decodedToken = jwt.decode(idToken, { complete: true });
    if (!decodedToken || !decodedToken.header || !decodedToken.header.kid) {
        throw new Error("Invalid token format");
    }

    const kid = decodedToken.header.kid;
    const publicKeys = await fetchGooglePublicKeys();
    const certificate = publicKeys[kid];

    if (!certificate) {
        throw new Error("Invalid token: public key not found");
    }

    const projectId = "student-management-syste-5b133";

    return new Promise((resolve, reject) => {
        jwt.verify(
            idToken,
            certificate,
            {
                algorithms: ["RS256"],
                audience: projectId,
                issuer: `https://securetoken.google.com/${projectId}`
            },
            (err, decoded) => {
                if (err) {
                    return reject(new Error(`Token verification failed: ${err.message}`));
                }
                resolve(decoded);
            }
        );
    });
};

/**
 * Google Sign-In / Register Handler
 */
export const googleLogin = async (req, res) => {
    try {
        const { idToken, role } = req.body;

        if (!idToken || !role) {
            return res.status(400).json({
                success: false,
                message: "Please provide Google ID token and role"
            });
        }

        // Verify the Firebase ID token
        let decodedToken;
        if (idToken === "mock_google_id_token" && config_ENV.NODE_ENV !== "production") {
            decodedToken = {
                email: `google_${role}_test@example.com`,
                name: `Google Test ${role.charAt(0).toUpperCase() + role.slice(1)}`,
                email_verified: true
            };
        } else {
            try {
                decodedToken = await verifyFirebaseIdToken(idToken);
            } catch (verifyErr) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: Invalid or expired Google token",
                    error: verifyErr.message
                });
            }
        }

        const email = decodedToken.email;
        const name = decodedToken.name;
        const emailVerified = decodedToken.email_verified;

        if (!emailVerified) {
            return res.status(403).json({
                success: false,
                message: "Your email address is not verified. Please verify your email first."
            });
        }

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "No email address associated with this Google token"
            });
        }

        // Find if user already exists in DB
        const result = await findUserByEmail(email, role);
        let user;

        if (result) {
            if (result.role !== role) {
                return res.status(400).json({
                    success: false,
                    message: `This email is already registered as a ${result.role}. You cannot login as a ${role}.`
                });
            }
            user = result.user;
            // If they are not verified in DB, verify them now since Google has authenticated them
            if (!user.isVerified) {
                user.isVerified = true;
                await user.save();
            }
        } else {
            // Register dynamically based on selected role (verified via Google)
            if (role === "admin") {
                const finalAdminId = generateAdminId();
                user = await Admin.create({
                    adminid: finalAdminId,
                    adminfullname: name || "Google Admin",
                    email,
                    password: await bcrypt.hash(Math.random().toString(36).slice(-10), 10),
                    isVerified: true
                });
            } else if (role === "faculty") {
                const finalFacultyId = generateFacultyId();
                const parts = (name || "Google Faculty").trim().split(/\s+/);
                const firstName = parts[0] || "Faculty";
                const lastName = parts.slice(1).join(" ") || "Member";
                user = await Faculty.create({
                    facultyId: finalFacultyId,
                    firstName,
                    lastName,
                    email,
                    password: await bcrypt.hash(Math.random().toString(36).slice(-10), 10),
                    department: "General",
                    qualification: "Not Specified",
                    salary: 0,
                    isVerified: true
                });
            } else {
                const finalStudentId = generateStudentId();
                const parts = (name || "Google Student").trim().split(/\s+/);
                const firstName = parts[0] || "Student";
                const lastName = parts.slice(1).join(" ") || "Member";
                user = await Student.create({
                    studentId: finalStudentId,
                    firstName,
                    lastName,
                    email,
                    password: await bcrypt.hash(Math.random().toString(36).slice(-10), 10),
                    isVerified: true
                });
            }
        }

        // Generate OTP and require email verification for Google Sign-In
        const otp = generateOTP();
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.verifyOtp = otp;
        user.verifyOtpExpire = otpExpire;
        await user.save();

        await sendVerificationOtp(
            email,
            otp,
            user.adminfullname || user.username || (user.firstName ? `${user.firstName} ${user.lastName}`.trim() : "User")
        );

        res.status(200).json({
            success: true,
            requiresOtp: true,
            email,
            role,
            message: "A verification email has been sent to your email address. Please check your inbox and verify your identity."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Request Password Reset (Forgot Password)
 */
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide an email address"
            });
        }

        const result = await findUserByEmail(email);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "User with this email does not exist"
            });
        }

        const { user } = result;

        // Generate OTP and set expiration
        const otp = generateOTP();
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.verifyOtp = otp;
        user.verifyOtpExpire = otpExpire;
        await user.save();

        // Send reset email
        const userName = user.adminfullname || (user.firstName ? `${user.firstName} ${user.lastName}` : "User");
        await sendPasswordResetOtp(email, otp, userName);

        res.status(200).json({
            success: true,
            message: "Password reset OTP sent to your email"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Reset Password (using OTP)
 */
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        if (!email || !otp || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email, OTP, and new password"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        const result = await findUserByEmail(email);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const { user } = result;

        // Verify OTP
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

        // Reset password
        user.password = await bcrypt.hash(password, config_ENV.BCRYPT_SALT_ROUNDS || 10);
        user.verifyOtp = "";
        user.verifyOtpExpire = null;
        user.isVerified = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully. You can now log in."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
