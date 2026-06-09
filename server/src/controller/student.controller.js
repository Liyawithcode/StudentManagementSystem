import { Student } from '../model/student.model.js';
import { generateToken } from '../utils/generateToken.js';


// REGISTER STUDENT
export const registerStudent = async (req, res) => {
  try {
    const studentExists = await Student.findOne({
      email: req.body.email,
    });

    if (studentExists) {
      return res.status(400).json({
        message: "Student already exists",
      });
    }

    const student = await Student.create(req.body);

    res.status(201).json({
      success: true,
      student,
      token: generateToken(student),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN STUDENT
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await student.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      success: true,
      student,
      token: generateToken(student),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL STUDENTS (ADMIN)
exports.getAllStudents = async (req, res) => {
  const students = await Student.find();
  res.json(students);
};

// GET STUDENT BY ID
exports.getStudentById = async (req, res) => {
  const student = await Student.findById(req.body.studentId);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
};

// UPDATE STUDENT
exports.updateStudent = async (req, res) => {
  const student = await Student.findByIdAndUpdate(
    req.body.studentId,
    req.body,
    { new: true }
  );

  res.json({
    success: true,
    student,
  });
};

// DELETE STUDENT
exports.deleteStudent = async (req, res) => {
  await Student.findByIdAndDelete(req.body.studentId);

  res.json({
    success: true,
    message: "Student deleted successfully",
  });
};