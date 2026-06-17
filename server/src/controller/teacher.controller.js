import { Faculty } from "../model/faculty.model.js";
import { Timetable } from "../model/timetable.model.js";

export const allocateSubjectToTeacher = async (req, res) => {
  try {
    const { facultyId, subjectCode } = req.body;
    if (!facultyId || !subjectCode) {
      return res.status(400).json({ success: false, message: "Faculty ID and subject code are required" });
    }

    const teacher = await Faculty.findOne({ facultyId });
    if (!teacher) return res.status(404).json({ success: false, message: "Teacher not found" });

    if (!teacher.subjects.includes(subjectCode)) {
      teacher.subjects.push(subjectCode);
      await teacher.save();
    }

    res.status(200).json({ success: true, message: "Subject allocated successfully", teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeacherSchedules = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const schedules = await Timetable.find({ facultyId });
    res.status(200).json({ success: true, count: schedules.length, schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
