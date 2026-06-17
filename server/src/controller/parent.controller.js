import { Parent } from "../model/parent.model.js";
import { Student } from "../model/student.model.js";
import { Attendance } from "../model/attendance.model.js";
import { Result } from "../model/result.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

export const registerParent = async (req, res) => {
  try {
    const { email, password, parentFullName, phone, studentIds } = req.body;
    if (!email || !password || !parentFullName) {
      return res.status(400).json({ success: false, message: "Required: email, password, parentFullName" });
    }

    const existingParent = await Parent.findOne({ email });
    if (existingParent) {
      return res.status(400).json({ success: false, message: "Parent already registered with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const parent = await Parent.create({
      parentFullName,
      email,
      password: hashedPassword,
      phone,
      studentIds: studentIds || []
    });

    res.status(201).json({ success: true, parent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginParent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const parent = await Parent.findOne({ email }).select("+password");
    if (!parent) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, parent.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const accessToken = generateAccessToken(parent);
    res.status(200).json({ success: true, parent, accessToken });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getChildProgress = async (req, res) => {
  try {
    const { studentId } = req.params;
    const parent = await Parent.findById(req.user._id);

    if (!parent.studentIds.includes(studentId)) {
      return res.status(403).json({ success: false, message: "Access denied. Student is not linked to this parent profile." });
    }

    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    const attendance = await Attendance.find({ studentId });
    const results = await Result.find({ studentId });

    res.status(200).json({
      success: true,
      student: { studentId: student.studentId, firstName: student.firstName, lastName: student.lastName },
      attendance,
      results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
