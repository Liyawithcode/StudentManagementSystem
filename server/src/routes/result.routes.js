import express from "express";
import { addResult, getAllResults, getResultByStudent, updateResult, deleteResult } from "../controller/result.controller.js";
import { enterMarks } from "../controller/marks.controller.js";
import { getGradingScale, updateGradingScale } from "../controller/grade.controller.js";
import { generateCertificate } from "../controller/certificate.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

export const resultRouter = express.Router();

resultRouter.use(protect);

// Grade management
resultRouter.route("/grading-scale")
    .get(getGradingScale)
    .put(restrictTo("admin"), updateGradingScale);

// Certificate creation
resultRouter.post("/certificate", generateCertificate);

// Marks entry
resultRouter.post("/marks", restrictTo("faculty", "admin"), enterMarks);

// Core Results routes
resultRouter.route("/")
    .get(getAllResults)
    .post(restrictTo("faculty", "admin"), addResult);

resultRouter.get("/student/:studentId", getResultByStudent);

resultRouter.route("/:id")
    .put(restrictTo("faculty", "admin"), updateResult)
    .delete(restrictTo("admin"), deleteResult);
