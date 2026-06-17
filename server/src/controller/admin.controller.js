import bcrypt from "bcryptjs";
import { Admin } from "../model/admin.model.js";
import { Student } from "../model/student.model.js";
import { Faculty } from "../model/faculty.model.js";
import { Course } from "../model/course.model.js";
import { Fee } from "../model/fee.model.js";
import { generateOTP } from "./auth.controller.js";
import { sendVerificationOtp } from "../utils/sendEmail.js";

/**
 * Register Admin
 */
export const registerAdmin = async (req, res) => {
    try {
        const { email, password, adminfullname, phone, adminid } = req.body;

        if (!email || !password || !adminfullname) {
            return res.status(400).json({
                success: false,
                message: "Please provide email, password and full name"
            });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Admin already exists with this email"
            });
        }

        const finalAdminId = adminid || `ADM${Math.floor(10000 + Math.random() * 90000)}`;
        const existingAdminId = await Admin.findOne({ adminid: finalAdminId });
        if (existingAdminId) {
            return res.status(400).json({
                success: false,
                message: "Generated Admin ID already exists, please try again"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const otpExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        const admin = await Admin.create({
            adminid: finalAdminId,
            adminfullname,
            email,
            password: hashedPassword,
            phone,
            verifyOtp: otp,
            verifyOtpExpire: otpExpire,
            isVerified: false
        });

        // Send Email Verification OTP
        await sendVerificationOtp(email, otp);

        const adminResponse = admin.toObject();
        delete adminResponse.password;
        delete adminResponse.verifyOtp;
        delete adminResponse.verifyOtpExpire;

        res.status(201).json({
            success: true,
            message: "Admin registered successfully. Verification OTP sent to email.",
            admin: adminResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get Current Admin Profile
 */
export const getProfile = async (req, res) => {
    try {
        // req.user contains the full user from middleware
        const adminObj = req.user.toObject();
        delete adminObj.password;

        res.status(200).json({
            success: true,
            admin: adminObj
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Update Admin Profile
 */
export const updateProfile = async (req, res) => {
    try {
        const { adminfullname, phone, profileImage } = req.body;
        
        const updateData = {};
        if (adminfullname) updateData.adminfullname = adminfullname;
        if (phone) updateData.phone = phone;
        if (profileImage !== undefined) updateData.profileImage = profileImage;

        const updatedAdmin = await Admin.findByIdAndUpdate(
            req.user._id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Admin profile updated successfully",
            admin: updatedAdmin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get Stats Dashboard for Admin
 */
export const getStats = async (req, res) => {
    try {
        const studentCount = await Student.countDocuments();
        const facultyCount = await Faculty.countDocuments();
        const courseCount = await Course.countDocuments();
        const pendingFeesCount = await Fee.countDocuments({ feeStatus: { $in: ["pending", "Partial"] } });

        res.status(200).json({
            success: true,
            stats: {
                students: studentCount,
                faculty: facultyCount,
                courses: courseCount,
                pendingFees: pendingFeesCount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
