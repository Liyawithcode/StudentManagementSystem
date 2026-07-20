import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema(
  {
    receiptNumber: {
      type: String,
      required: [true, "Receipt number is required"],
      unique: true,
      trim: true,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: [true, "Payment ID is required"],
    },
    studentId: {
      type: String,
      required: [true, "Student ID is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    GST: {
      type: Number,
      default: 0,
      min: [0, "GST cannot be negative"],
    },
    paymentDate: {
      type: Date,
      required: [true, "Payment date is required"],
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
    },
    transactionId: {
      type: String,
      trim: true,
      default: "",
    },
    pdfReceiptUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

export const Receipt = mongoose.model("Receipt", receiptSchema);
