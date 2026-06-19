import express from "express";
import { scheduleExam, getExamSchedules, deleteExamSchedule } from "../controller/exam.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

export const examRouter = express.Router();

examRouter.use(protect);

examRouter.route("/schedules")
    .get(getExamSchedules)
    .post(restrictTo("admin", "faculty"), scheduleExam);

examRouter.delete("/schedules/:id", restrictTo("admin"), deleteExamSchedule);
