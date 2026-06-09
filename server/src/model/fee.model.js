import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
     {
          studentId:
          {
               type: String,
               required: true,
               trim: true
          },
          courseId:
          {
               type: String,
               required: true,
               trim: true
          },
          feeAmount:
          {
               type: Number,
               required: true
          },
          feeType:
          {
               type: String,
               required: true,
               enum: ["Admission", "Examination", "Hostel", "Library", "Other"],
          },
          feeStatus:
          {
               type: String,
               required: true,
               enum: ["Paid", "pending", "Partial"],
               default: "pending"
          },
          dueDate:
          {
               type: Date,
               required: true
          },
          paymentMethod: {
               type: String,
               enum: ["CASH", "CARD", "UPI", "BANK_TRANSFER"],
               default: "CASH",
          },
     },
     { timestamps: true }
);

export const Fee = mongoose.model("Fee", feeSchema);