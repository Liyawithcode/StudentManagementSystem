import express from "express";
import { registerFaculty, loginFaculty, getAllFaculties, getFacultyById, getProfile as getFacultyProfile, updateFaculty, deleteFaculty } from "../controller/faculty.controller.js";
import { applyLeave, getMyLeaveRequests, getFacultyLeaveRequests, getLeaveRequests, updateLeaveStatus } from "../controller/leave.controller.js";
import { allocateSubjectToTeacher, getTeacherSchedules } from "../controller/teacher.controller.js";
import { getStaffList, createStaff, deleteStaff } from "../controller/staff.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

export const facultyRouter = express.Router();

// Public routes
facultyRouter.post("/register", registerFaculty);
facultyRouter.post("/login", loginFaculty);

// Protected routes
facultyRouter.use(protect);

facultyRouter.get("/", getAllFaculties);
facultyRouter.get("/profile", getFacultyProfile);

// Leave application & approvals
facultyRouter.post("/leave", applyLeave);
facultyRouter.get("/leave/all", getLeaveRequests);
facultyRouter.get("/leave/faculty-requests", getFacultyLeaveRequests);
facultyRouter.put("/leave/:id/status", updateLeaveStatus);
facultyRouter.get("/leave/:applicantId", getMyLeaveRequests);

// Teacher assignment and schedules
facultyRouter.post("/allocate-subject", restrictTo("admin"), allocateSubjectToTeacher);
facultyRouter.get("/schedules/:facultyId", getTeacherSchedules);

// Staff management
facultyRouter.route("/staff")
    .get(getStaffList)
    .post(restrictTo("admin"), createStaff);

facultyRouter.delete("/staff/:id", restrictTo("admin"), deleteStaff);

// Faculty specific details
facultyRouter.route("/:facultyId")
    .get(getFacultyById)
    .put(restrictTo("admin", "faculty"), updateFaculty)
    .delete(restrictTo("admin"), deleteFaculty);
