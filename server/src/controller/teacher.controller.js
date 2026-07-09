import mongoose from "mongoose";
import { Faculty } from "../model/faculty.model.js";
import { Timetable } from "../model/timetable.model.js";

export const allocateSubjectToTeacher = async (req, res) => {
  try {
    const { facultyId, subjectCode } = req.body;
    if (!facultyId || !subjectCode) {
      return res.status(400).json({ success: false, message: "Faculty ID and subject code are required" });
    }

    const teacher = await Faculty.findOne({
      $or: [
        { facultyId },
        { _id: mongoose.Types.ObjectId.isValid(facultyId) ? facultyId : new mongoose.Types.ObjectId() }
      ]
    });
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
    
    // Find the faculty document first using either ObjectID or custom facultyId
    const faculty = await Faculty.findOne({
      $or: [
        { facultyId },
        { _id: mongoose.Types.ObjectId.isValid(facultyId) ? facultyId : new mongoose.Types.ObjectId() }
      ]
    });

    if (!faculty) {
      return res.status(404).json({ success: false, message: "Faculty member not found" });
    }

    // Find timetable records matching either field
    const schedules = await Timetable.find({
      $or: [
        { facultyId: faculty.facultyId },
        { facultyId: faculty._id.toString() }
      ]
    });

    res.status(200).json({ success: true, count: schedules.length, schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
