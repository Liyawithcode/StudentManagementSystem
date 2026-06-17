import { Student } from "../model/student.model.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import { generateOTP } from "./auth.controller.js";
import { sendVerificationOtp } from "../utils/sendEmail.js";

// Register Student
export const registerStudent = async (req, res) => {
  try {
    const { email, password, studentId, ...studentData } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student already exists with this email",
      });
    }

    // Generate custom studentId if not provided
    const finalStudentId = studentId || `STU${Math.floor(10000 + Math.random() * 90000)}`;
    const existingStudentId = await Student.findOne({ studentId: finalStudentId });
    if (existingStudentId) {
      return res.status(400).json({
        success: false,
        message: "Generated Student ID already exists, please try again",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const student = await Student.create({
      ...studentData,
      studentId: finalStudentId,
      email,
      password: hashedPassword,
      verifyOtp: otp,
      verifyOtpExpire: otpExpire,
      isVerified: false,
    });

    // Send email verification OTP
    await sendVerificationOtp(email, otp);

    const accessToken = generateAccessToken(student);
    const refreshToken = generateRefreshToken(student);

    res.cookie("refreshToken", refreshToken, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    const studentResponse = student.toObject();
    delete studentResponse.password;
    delete studentResponse.verifyOtp;
    delete studentResponse.verifyOtpExpire;

    res.status(201).json({
      success: true,
      message: "Student registered successfully. Verification OTP sent to email.",
      student: studentResponse,
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login Student
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const student = await Student.findOne({ email }).select("+password");

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = generateAccessToken(student);
    const refreshToken = generateRefreshToken(student);

    res.cookie("refreshToken", refreshToken, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    const studentResponse = student.toObject();
    delete studentResponse.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      student: studentResponse,
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();

    res.status(200).json({
      success: true,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Student
export const getStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.body.studentId || req.query.studentId;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Please provide student ID",
      });
    }

    const student = await Student.findOne({ studentId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Student
export const updateStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.body.studentId;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Please provide student ID",
      });
    }

    const { email, password, role, isVerified, ...updateData } = req.body;

    const student = await Student.findOneAndUpdate(
      { studentId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Student
export const deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.body.studentId;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Please provide student ID",
      });
    }

    const student = await Student.findOneAndDelete({ studentId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};