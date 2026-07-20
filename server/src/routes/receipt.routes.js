import express from "express";
import { getReceiptByPaymentId, downloadReceiptPDF } from "../controller/receipt.controller.js";
import { protect } from "../middleware/auth.middleware.js";

export const receiptRouter = express.Router();

receiptRouter.use(protect);

receiptRouter.get("/:paymentId", getReceiptByPaymentId);
receiptRouter.get("/download/:paymentId", downloadReceiptPDF);
