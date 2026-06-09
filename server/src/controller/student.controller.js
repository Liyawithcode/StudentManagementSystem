import studentService from "../services/student.services.js";
import bcrypt from "bcrypt";

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

  
    const studentExists = await studentService.checkStudentExists(email, studentId);

    if (studentExists) {
      return res.status(400).json({
        success: false,
        message: "Student already exists",
      });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = await studentService.createStudentService({
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
      message: "Student created successfully",
      data: newStudent,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllStudents = async (req, res, next) => {
  try {
    const students = await studentService.getAllStudentsService();
    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};


export const getStudentById = async (req, res, next) => {
  try {
    const student = await studentService.getStudentByIdService(req.body);

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

export const updateStudent = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

  
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    let student = await studentService.updateStudentService(req.body, updateData);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const student = await studentService.deleteStudentService(req.params.id);

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
    next(error);
  }
};

