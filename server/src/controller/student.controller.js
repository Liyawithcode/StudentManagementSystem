import Student from "../model/student.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

// Register Student
export const registerStudent = async (req, res) => {
  try {
    const { email, password, ...studentData } = req.body;

    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      ...studentData,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      student,
      token: generateToken(student),
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

    const student = await Student.findOne({ email });

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

    res.status(200).json({
      success: true,
      message: "Login successful",
      student,
      token: generateToken(student),
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
    const { studentId } = req.body;

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
    const { studentId, ...updateData } = req.body;

    const student = await Student.findOneAndUpdate(
      { studentId },
      updateData,
      { new: true }
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
    const { studentId } = req.body;

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