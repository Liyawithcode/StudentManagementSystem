import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    applicantId: {
      type: String,
      required: [true, "Applicant ID is required"],
      trim: true,
    },
    applicantType: {
      type: String,
      required: true,
      enum: ["Student", "Faculty", "Staff"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    reason: {
      type: String,
      required: [true, "Reason for leave is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "Approved", "Rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Leave = mongoose.model("Leave", leaveSchema);
