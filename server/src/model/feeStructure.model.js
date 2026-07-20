import mongoose from "mongoose";

const feeStructureSchema = new mongoose.Schema(
  {
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
    academicYear: {
      type: String,
      required: [true, "Academic year is required"],
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
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    lateFine: {
      type: Number,
      default: 0,
      min: [0, "Late fine cannot be negative"],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const FeeStructure = mongoose.model("FeeStructure", feeStructureSchema);
