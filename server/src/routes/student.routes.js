import express from "express";
import { registerStudent, loginStudent, getAllStudents, getStudent, updateStudent, deleteStudent } from "../controller/student.controller.js";
import { getAlumniList, promoteToAlumni } from "../controller/alumni.controller.js";
import { enrollStudentInClass, getEnrollmentHistory } from "../controller/enrollment.controller.js";
import { applyLeave, getMyLeaveRequests } from "../controller/leave.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";

export const studentRouter = express.Router();

// Validation Rules
const studentRegisterSchema = {
  email: { required: true, type: "string", isEmail: true },
  password: { required: true, type: "string", minLength: 6 },
  firstName: { required: true, type: "string" },
  lastName: { required: true, type: "string" }
};

const studentLoginSchema = {
  email: { required: true, type: "string", isEmail: true },
  password: { required: true, type: "string" }
};

// Public routes for auth
studentRouter.post("/register", validateRequest(studentRegisterSchema), registerStudent);
studentRouter.post("/login", validateRequest(studentLoginSchema), loginStudent);

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
