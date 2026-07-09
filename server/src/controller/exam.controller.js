import { Exam } from "../model/exam.model.js";

export const scheduleExam = async (req, res) => {
  try {
    const { examName, courseCode, examDate, time, room, totalMarks } = req.body;
    if (!examName || !examDate) {
      return res.status(400).json({ success: false, message: "Please provide exam name and date" });
    }

    const exam = await Exam.create({
      examName,
      courseCode: courseCode || "",
      examDate,
      time: time || "",
      room: room || "",
      totalMarks: totalMarks || 100,
    });

    res.status(201).json({ success: true, message: "Exam scheduled successfully", exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getExamSchedules = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ examDate: 1 });
    res.status(200).json({ success: true, count: exams.length, exams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteExamSchedule = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam schedule not found" });
    }
    res.status(200).json({ success: true, message: "Exam schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

