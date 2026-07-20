import express from "express";
import {
  createOrder,
  verifyPayment,
  recordOfflinePayment,
  getAllPayments,
  getPaymentById,
  getPaymentsByStudentId,
  updatePaymentStatus,
  deletePayment,
  refundPayment,
} from "../controller/payment.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

export const paymentRouter = express.Router();

paymentRouter.use(protect);

// Order creation, verification, and offline submission
paymentRouter.post("/create-order", createOrder);
paymentRouter.post("/verify", verifyPayment);
paymentRouter.post("/offline", recordOfflinePayment);

// Payment query & management endpoints
paymentRouter
  .route("/")
  .get(restrictTo("admin", "faculty"), getAllPayments);

paymentRouter.post("/refund", restrictTo("admin"), refundPayment);

paymentRouter
  .route("/:id")
  .get(getPaymentById)
  .put(restrictTo("admin"), updatePaymentStatus)
  .delete(restrictTo("admin"), deletePayment);

paymentRouter.get("/student/:studentId", getPaymentsByStudentId);
