import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        courseCode: 
        {
             type: String, 
             required: true, 
             unique: true 
        },
        courseName: 
        {
             type: String, 
             required: true
        },
        department: 
        {
             type: String, 
             required: true
        },
        credits: 
        {
             type: Number, 
             required: true
        },
    },
    { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);