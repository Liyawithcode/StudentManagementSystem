import express from "express";
import { recordAttendance, getStudentAttendance, getCourseAttendance, updateAttendance } from "../controller/attendance.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

export const attendanceRouter = express.Router();

attendanceRouter.use(protect);

attendanceRouter.post("/record", restrictTo("faculty", "admin"), recordAttendance);
attendanceRouter.get("/student", getStudentAttendance);
attendanceRouter.get("/course", getCourseAttendance);
// Put request to update attendance
attendanceRouter.put("/update", restrictTo("faculty", "admin"), updateAttendance);
