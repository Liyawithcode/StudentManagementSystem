import { Exam } from "../model/exam.model.js";

export const scheduleExam = async (examData) => {
  return await Exam.create(examData);
};

export const getExamSchedules = async () => {
  return await Exam.find();
};

export const deleteExamSchedule = async (id) => {
  return await Exam.findByIdAndDelete(id);
};
