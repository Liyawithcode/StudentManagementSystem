import Student from "../model/student.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

export const registerStudent = async (req, res) => {
  try {
    const {
      studentId,
      firstName,
      lastName,
      email,
      password,
      role,
      gender,
      dateOfBirth,
      phone,
      department,
    } = req.body;

    // check if student exists
    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student already exists",
      });
    }

    // hash password manually (optional, schema also handles it)
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      studentId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      gender,
      dateOfBirth,
      phone,
      department,
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
      student: {
        id: student._id,
        studentId: student.studentId,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        role: student.role,
      },
      token: generateToken(student),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getStudentById = async (req, res) => {
  try {
    const getstudent = req.body;
    const student = await Student.findOne({ getstudent });

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


export const updateStudent = async (req, res) => {
  try {
    const upstudent = req.body;
    // const { firstName, lastName, email, password, role, gender, dateOfBirth, phone, department } = req.body;

    const student = await Student.findOneAndUpdate(
      {upstudent},
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


export const deleteStudent = async (req, res) => {
  try {
    const delstudent = req.body;
    const student = await Student.findOneAndDelete({ delstudent });

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