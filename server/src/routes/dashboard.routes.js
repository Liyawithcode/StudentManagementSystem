import express from "express";
import { getDashboardStats, getPublicStats } from "../controller/dashboard.controller.js";
import { protect } from "../middleware/auth.middleware.js";

export const dashboardRouter = express.Router();

dashboardRouter.get("/public", getPublicStats);
dashboardRouter.get("/", protect, getDashboardStats);
