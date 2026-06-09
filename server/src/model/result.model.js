import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
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
        totalMarks: 
        {
             type: Number, 
             required: true
        },
        obtainedMarks: 
        {
             type: Number, 
             required: true
        },
        percentage: 
        {
             type: Number, 
             required: true
        },
        grade: 
        {
             type: String, 
             required: true
        },
    },
    { timestamps: true }
);

export const Result = mongoose.model("Result", resultSchema);