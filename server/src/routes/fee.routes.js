import express from "express";
import { createFee, getAllFees, getFeesByStudent, updatePayment, deleteFee } from "../controller/fee.controller.js";
import { getInvoice } from "../controller/invoice.controller.js";
import { recordPayment } from "../controller/payment.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

export const feeRouter = express.Router();

feeRouter.use(protect);

// Fee creation and listing
feeRouter.route("/")
    .get(restrictTo("admin", "faculty"), getAllFees)
    .post(restrictTo("admin"), createFee);

feeRouter.get("/student/:studentId", getFeesByStudent);
feeRouter.put("/payment/:id", restrictTo("admin"), updatePayment);
feeRouter.delete("/:id", restrictTo("admin"), deleteFee);

// Invoices
feeRouter.get("/invoice/:id", getInvoice);

// Direct Payment processing
feeRouter.post("/record-payment", restrictTo("admin"), recordPayment);

