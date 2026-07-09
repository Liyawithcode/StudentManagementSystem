import * as studentService from "../services/studentService.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, config_ENV } from "../config/auth.config.js";
import { generateOTP, sendVerificationOtp, generateStudentId } from "../utils/index.js";

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

    const existingStudent = await studentService.findStudentByEmail(email);

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student already exists with this email",
      });
    }

    // Generate custom studentId if not provided
    const finalStudentId = studentId || generateStudentId();
    const existingStudentId = await studentService.findStudentById(finalStudentId);
    if (existingStudentId) {
      return res.status(400).json({
        success: false,
        message: "Generated Student ID already exists, please try again",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const student = await studentService.createStudent({
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

    const student = await studentService.findStudentByEmail(email, "+password");

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
    const students = await studentService.findAllStudents();

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

    const student = await studentService.findStudentById(studentId);

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

    const student = await studentService.updateStudent(studentId, updateData);

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

    const student = await studentService.deleteStudent(studentId);

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