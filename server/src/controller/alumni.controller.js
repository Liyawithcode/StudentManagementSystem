import { Student } from "../model/student.model.js";

export const getAlumniList = async (req, res) => {
  try {
    const alumni = await Student.find({ enrollmentStatus: "Graduated" });
    res.status(200).json({ success: true, count: alumni.length, alumni });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const promoteToAlumni = async (req, res) => {
  try {
    const { studentId } = req.body;
    const student = await Student.findOneAndUpdate(
      { studentId },
      { $set: { enrollmentStatus: "Graduated" } },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, message: "Student promoted to Alumni registry", student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
