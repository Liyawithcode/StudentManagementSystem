import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    examName: {
      type: String,
      required: [true, "Exam name is required"],
      trim: true,
    },
    courseCode: {
      type: String,
      required: [true, "Course code is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Exam date is required"],
    },
    time: {
      type: String, // format "HH:MM"
      required: [true, "Exam time is required"],
    },
    roomNumber: {
      type: String,
      required: [true, "Room number is required"],
      trim: true,
    },
    totalMarks: {
      type: Number,
      required: [true, "Total marks is required"],
      default: 100,
    },
  },
  { timestamps: true }
);

export const Exam = mongoose.model("Exam", examSchema);
