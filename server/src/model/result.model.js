import mongoose from "mongoose";


const subjectSchema = new mongoose.Schema(
     {
     subjectName: {
    type: String,
    required: true,
  },
  marks: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
});

const resultSchema = new mongoose.Schema(
    {
        studentId: 
        {
             type: String, 
             required: true,
             trim: true
        },
        courseName: 
        {
             type: String, 
             required: true,
             trim: true
        },
          subjects: [subjectSchema],

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
        resultStatus: 
        {
             type: String, 
             default: "Pass",
             enum: ["Pass", "Fail"]
        }
    },
    { timestamps: true }
);

export const Result = mongoose.model("Result", resultSchema);