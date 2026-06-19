import express from "express";
import { registerCandidate, approveAdmission } from "../controller/admission.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

export const admissionRouter = express.Router();

// Candidate registration is public
admissionRouter.post("/register", registerCandidate);

// Approving admission is protected and only for admin
admissionRouter.post("/approve", protect, restrictTo("admin"), approveAdmission);
