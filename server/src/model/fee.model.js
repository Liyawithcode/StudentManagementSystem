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
             enum: ["Admission", "Examination", "Other"]
        },
        feeStatus: 
        {
             type: String, 
             required: true,
             enum: ["Paid", "Unpaid"]
        },
        dueDate: 
        {
             type: Date, 
             required: true
        },
    },
    { timestamps: true }
);

export const Fee = mongoose.model("Fee", feeSchema);