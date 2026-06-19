import express from "express";
import { registerStudent, loginStudent, getAllStudents, getStudent, updateStudent, deleteStudent } from "../controller/student.controller.js";
import { getAlumniList, promoteToAlumni } from "../controller/alumni.controller.js";
import { enrollStudentInClass, getEnrollmentHistory } from "../controller/enrollment.controller.js";
import { applyLeave, getMyLeaveRequests } from "../controller/leave.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

export const studentRouter = express.Router();

// Public routes for auth
studentRouter.post("/register", registerStudent);
studentRouter.post("/login", loginStudent);

// Protected routes
studentRouter.use(protect);

studentRouter.get("/", getAllStudents);
studentRouter.get("/alumni", getAlumniList);
studentRouter.post("/promote-to-alumni", restrictTo("admin", "faculty"), promoteToAlumni);
studentRouter.post("/enroll", restrictTo("admin"), enrollStudentInClass);
studentRouter.get("/enrollment-history/:studentId", getEnrollmentHistory);

// Student Leave application
studentRouter.post("/leave", applyLeave);
studentRouter.get("/leave/:applicantId", getMyLeaveRequests);

studentRouter.route("/:studentId")
    .get(getStudent)
    .put(restrictTo("admin", "student"), updateStudent)
    .delete(restrictTo("admin"), deleteStudent);
