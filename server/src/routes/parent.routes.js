import express from "express";
import { registerParent, loginParent, getChildProgress } from "../controller/parent.controller.js";
import { protect } from "../middleware/auth.middleware.js";

export const parentRouter = express.Router();

parentRouter.post("/register", registerParent);
parentRouter.post("/login", loginParent);

parentRouter.get("/progress/:studentId", protect, getChildProgress);
