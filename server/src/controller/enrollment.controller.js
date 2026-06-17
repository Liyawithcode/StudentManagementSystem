import { Student } from "../model/student.model.js";

export const enrollStudentInClass = async (req, res) => {
  try {
    const { studentId, department, status } = req.body;
    if (!studentId) {
      return res.status(400).json({ success: false, message: "Student ID is required" });
    }

    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (department) student.department = department;
    if (status) student.enrollmentStatus = status;
    await student.save();

    res.status(200).json({ success: true, message: "Enrollment updated successfully", student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEnrollmentHistory = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    
    // Stub history record
    const history = [
      { date: student.admissionDate, status: "Admitted", department: student.department },
      { date: student.updatedAt, status: student.enrollmentStatus, department: student.department }
    ];

    res.status(200).json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
