import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: [true, "Class name is required"],
      trim: true,
    },
    section: {
      type: String,
      required: [true, "Section is required"],
      trim: true,
    },
    batch: {
      type: String,
      required: [true, "Batch is required"],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    day: {
      type: String,
      required: [true, "Day of week is required"],
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    },
    startTime: {
      type: String, // format "HH:MM" e.g., "09:00"
      required: [true, "Start time is required"],
    },
    endTime: {
      type: String, // format "HH:MM" e.g., "10:30"
      required: [true, "End time is required"],
    },
    roomNumber: {
      type: String,
      required: [true, "Room number is required"],
      trim: true,
    },
    facultyId: {
      type: String,
      required: [true, "Faculty supervisor ID is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

export const Timetable = mongoose.model("Timetable", timetableSchema);
