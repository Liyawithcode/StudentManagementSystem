import express from "express";
import { getHostelSummary, getRooms } from "../controller/hostel.controller.js";
import { createRoom, allocateRoom, vacateRoom } from "../controller/room.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

export const hostelRouter = express.Router();

hostelRouter.use(protect);

// Summary & listing
hostelRouter.get("/summary", getHostelSummary);
hostelRouter.get("/rooms", getRooms);

// Admin-only management
hostelRouter.post("/rooms", restrictTo("admin"), createRoom);
hostelRouter.post("/rooms/allocate/:id", restrictTo("admin"), allocateRoom);
hostelRouter.post("/rooms/vacate/:id", restrictTo("admin"), vacateRoom);
