import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
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
        status: 
        {
             type: String, 
             required: true,
             enum: ["Present", "Absent"]
        },
    },
    { timestamps: true }
);

export const Attendance = mongoose.model("Attendance", attendanceSchema);