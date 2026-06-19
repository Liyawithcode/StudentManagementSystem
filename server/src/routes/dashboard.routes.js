import express from "express";
import { getDashboardStats } from "../controller/dashboard.controller.js";
import { protect } from "../middleware/auth.middleware.js";

export const dashboardRouter = express.Router();

dashboardRouter.get("/", protect, getDashboardStats);
