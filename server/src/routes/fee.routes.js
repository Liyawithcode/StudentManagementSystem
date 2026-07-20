import express from "express";
import {
  createFee,
  getAllFees,
  updateFee,
  deleteFee,
  getFeesByStudent,
  updatePayment,
} from "../controller/fee.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

export const feeRouter = express.Router();

feeRouter.use(protect);

// Fee structures management
feeRouter
  .route("/")
  .get(restrictTo("admin", "faculty", "student"), getAllFees)
  .post(restrictTo("admin"), createFee);

feeRouter
  .route("/:id")
  .put(restrictTo("admin"), updateFee)
  .delete(restrictTo("admin"), deleteFee);

// Student ledger queries & direct updates (legacy support)
feeRouter.get("/student/:studentId", getFeesByStudent);
feeRouter.put("/payment/:id", restrictTo("admin"), updatePayment);
