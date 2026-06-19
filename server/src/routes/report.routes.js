import express from "express";
import { getAttendanceReport, getFeeReport, getAcademicReport } from "../controller/report.controller.js";
import { getPerformanceAnalytics, getEnrollmentAnalytics } from "../controller/analytics.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

export const reportRouter = express.Router();

reportRouter.use(protect);

// Basic Reports
reportRouter.get("/attendance", restrictTo("admin", "faculty"), getAttendanceReport);
reportRouter.get("/finance", restrictTo("admin"), getFeeReport);
reportRouter.get("/academic", restrictTo("admin", "faculty"), getAcademicReport);

// Advanced Analytics
reportRouter.get("/analytics/performance", restrictTo("admin", "faculty"), getPerformanceAnalytics);
reportRouter.get("/analytics/enrollment", restrictTo("admin", "faculty"), getEnrollmentAnalytics);
