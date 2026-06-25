import { Exam } from "../model/exam.model.js";
import { BaseService } from "./baseService.js";

const examDb = new BaseService(Exam);

export const scheduleExam = (examData) => examDb.create(examData);
export const getExamSchedules = () => examDb.find();
export const deleteExamSchedule = (id) => examDb.findByIdAndDelete(id);
