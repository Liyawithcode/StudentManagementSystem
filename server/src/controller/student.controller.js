import { Student } from "../model/student.model.js";
import bcrypt from "bcrypt";

// Create a new student (Registration)
export const createStudent = async (req, res, next) => {
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

    // Check if student already exists by email or studentId
    const studentExists = await Student.findOne({
      $or: [{ email }, { studentId }],
    });

    if (studentExists) {
      return res.status(400).json({
        success: false,
        message: "Student already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = await Student.create({
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

    // Remove password from response
    newStudent.password = undefined;

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: newStudent,
    });
  } catch (error) {
    next(error);
  }
};

// Get all students
export const getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find();
    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single student by ID
export const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.body);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// Update a student
export const updateStudent = async (req, res, next) => {
  try {
    let student = await Student.findByIdId(req.body);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // If password is being updated, hash it
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Remove password from response
    student.password = undefined;

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a student
export const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    await student.deleteOne();

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Alias for registration if originally named StudentController
export const StudentController = createStudent;
