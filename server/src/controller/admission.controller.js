import { Student } from "../model/student.model.js";
import { generateOTP, sendVerificationOtp, generateStudentId } from "../utils/index.js";
import bcrypt from "bcryptjs";
import { config_ENV } from "../config/auth.config.js";

export const registerCandidate = async (req, res) => {
  try {
    const { email, password, firstName, lastName, department, ...data } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ success: false, message: "Required fields: email, password, firstName, lastName" });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ success: false, message: "Candidate already registered with this email" });
    }

    const finalStudentId = generateStudentId();
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const student = await Student.create({
      ...data,
      studentId: finalStudentId,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      department,
      enrollmentStatus: "Inactive", // Inactive until approved
      verifyOtp: otp,
      verifyOtpExpire: new Date(Date.now() + 15 * 60 * 1000),
      isVerified: false
    });

    await sendVerificationOtp(email, otp);

    res.status(201).json({ success: true, message: "Application submitted. Verification OTP sent.", studentId: finalStudentId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveAdmission = async (req, res) => {
  try {
    const { studentId } = req.body;
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    student.enrollmentStatus = "Active";
    await student.save();

    res.status(200).json({ success: true, message: "Admission approved. Student is now Active.", student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
