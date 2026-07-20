import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, "Student ID is required"],
      trim: true,
    },
    enrollmentNumber: {
      type: String,
      required: [true, "Enrollment number is required"],
      trim: true,
    },
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    class: {
      type: String,
      required: [true, "Class is required"],
      trim: true,
    },
    semester: {
      type: String,
      required: [true, "Semester is required"],
      trim: true,
    },
    feeCategory: {
      type: String,
      required: [true, "Fee category is required"],
      enum: [
        "Admission Fee",
        "Tuition Fee",
        "Exam Fee",
        "Library Fee",
        "Hostel Fee",
        "Transport Fee",
        "Uniform Fee",
        "Fine",
        "Miscellaneous Fee",
      ],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: [0, "Paid amount cannot be negative"],
    },
    dueAmount: {
      type: Number,
      required: [true, "Due amount is required"],
      min: [0, "Due amount cannot be negative"],
    },
    paymentMethod: {
      type: String,
      enum: [
        "Credit Card",
        "Debit Card",
        "UPI",
        "Net Banking",
        "Wallet",
        "QR Code Payment",
        "Cash",
        "Cheque",
        "Demand Draft",
        "Bank Transfer",
        "None",
      ],
      default: "None",
    },
    paymentGateway: {
      type: String,
      enum: ["Stripe", "Razorpay", "PayPal", "None"],
      default: "None",
    },
    transactionId: {
      type: String,
      trim: true,
      default: "",
    },
    orderId: {
      type: String,
      trim: true,
      default: "",
    },
    receiptNumber: {
      type: String,
      trim: true,
      default: "",
    },
    paymentDate: {
      type: Date,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Processing", "Refunded", "Cancelled"],
      default: "Pending",
    },
    remarks: {
      type: String,
      trim: true,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
