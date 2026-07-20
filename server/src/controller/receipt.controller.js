import { Receipt } from "../model/receipt.model.js";
import { Payment } from "../model/payment.model.js";
import { generateReceiptPDF } from "../utils/pdfGenerator.js";
import path from "path";
import fs from "fs";

/**
 * Fetch receipt metadata by Payment ID
 */
export const getReceiptByPaymentId = async (req, res) => {
  try {
    const { paymentId } = req.params;

    let receipt = await Receipt.findOne({ paymentId });

    if (!receipt) {
      // If payment is paid, generate receipt dynamically
      const payment = await Payment.findById(paymentId);
      if (payment && payment.paymentStatus === "Paid") {
        const rNumber = payment.receiptNumber || `REC-${Date.now()}`;
        payment.receiptNumber = rNumber;
        await payment.save();

        const gstValue = payment.totalAmount * 0.18;
        receipt = await Receipt.create({
          receiptNumber: rNumber,
          paymentId: payment._id,
          studentId: payment.studentId,
          amount: payment.totalAmount,
          GST: gstValue,
          paymentDate: payment.paymentDate || new Date(),
          paymentMethod: payment.paymentMethod || "CASH",
          transactionId: payment.transactionId || `txn_${Date.now()}`,
        });

        const pdfUrl = await generateReceiptPDF(payment, receipt);
        receipt.pdfReceiptUrl = pdfUrl;
        await receipt.save();
      } else {
        return res.status(404).json({
          success: false,
          message: "Receipt not found. Ensure payment is paid and verified.",
        });
      }
    }

    res.status(200).json({ success: true, receipt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Download Receipt PDF file by Payment ID
 */
export const downloadReceiptPDF = async (req, res) => {
  try {
    const { paymentId } = req.params;

    let receipt = await Receipt.findOne({ paymentId });
    let payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment record not found" });
    }

    if (payment.paymentStatus !== "Paid") {
      return res.status(400).json({
        success: false,
        message: "PDF receipt is only available for paid invoices.",
      });
    }

    // Auto generate if receipt record is missing but payment is Paid
    if (!receipt) {
      const rNumber = payment.receiptNumber || `REC-${Date.now()}`;
      payment.receiptNumber = rNumber;
      await payment.save();

      const gstValue = payment.totalAmount * 0.18;
      receipt = await Receipt.create({
        receiptNumber: rNumber,
        paymentId: payment._id,
        studentId: payment.studentId,
        amount: payment.totalAmount,
        GST: gstValue,
        paymentDate: payment.paymentDate || new Date(),
        paymentMethod: payment.paymentMethod || "CASH",
        transactionId: payment.transactionId || `txn_${Date.now()}`,
      });

      const pdfUrl = await generateReceiptPDF(payment, receipt);
      receipt.pdfReceiptUrl = pdfUrl;
      await receipt.save();
    }

    // Ensure the PDF file actually exists on disk
    let pdfUrlPath = receipt.pdfReceiptUrl;
    if (!pdfUrlPath) {
      pdfUrlPath = await generateReceiptPDF(payment, receipt);
      receipt.pdfReceiptUrl = pdfUrlPath;
      await receipt.save();
    }

    // Resolve absolute path on disk
    // receipt.pdfReceiptUrl is like "/public/receipts/receipt_REC-xxx.pdf"
    const relativeFilePath = pdfUrlPath.startsWith("/") ? pdfUrlPath.slice(1) : pdfUrlPath;
    const absolutePath = path.resolve(relativeFilePath);

    if (!fs.existsSync(absolutePath)) {
      // Regenerate if file was deleted
      await generateReceiptPDF(payment, receipt);
    }

    res.download(absolutePath, `Receipt-${receipt.receiptNumber}.pdf`, (err) => {
      if (err) {
        console.error("PDF download transfer error:", err);
        if (!res.headersSent) {
          res.status(500).json({ success: false, message: "Failed to download receipt PDF" });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
