import { Result } from "../model/result.model.js";

// Helper to calculate grades and statistics based on subjects
const calculateResultStats = (subjects) => {
  let obtainedMarks = 0;
  const totalMarks = subjects.length * 100; // Assuming each subject is out of 100

  subjects.forEach((sub) => {
    obtainedMarks += sub.marks;
  });

  const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;

  let grade = "F";
  if (percentage >= 90) grade = "A+";
  else if (percentage >= 75) grade = "A";
  else if (percentage >= 60) grade = "B";
  else if (percentage >= 40) grade = "C";

  const resultStatus = percentage >= 40 ? "Pass" : "Fail";

  return {
    totalMarks,
    obtainedMarks,
    percentage,
    grade,
    resultStatus,
  };
};

// Add Result Record
export const addResult = async (req, res) => {
  try {
    const { studentId, courseName, subjects } = req.body;

    if (!studentId || !courseName || !subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide studentId, courseName and a non-empty subjects array",
      });
    }

    // Validate marks for each subject
    for (const sub of subjects) {
      if (!sub.subjectName || sub.marks === undefined || sub.marks < 0 || sub.marks > 100) {
        return res.status(400).json({
          success: false,
          message: "Each subject must have a subjectName and marks between 0 and 100",
        });
      }
    }

    const stats = calculateResultStats(subjects);

    const result = await Result.create({
      studentId,
      courseName,
      subjects,
      ...stats,
    });

    res.status(201).json({
      success: true,
      message: "Result recorded successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Results
export const getAllResults = async (req, res) => {
  try {
    const results = await Result.find();

    res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Result by Student ID
export const getResultByStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.query.studentId;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Please provide student ID",
      });
    }

    const results = await Result.find({ studentId });

    res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Result Record
export const updateResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseName, subjects } = req.body;

    const existingResult = await Result.findById(id);
    if (!existingResult) {
      return res.status(404).json({
        success: false,
        message: "Result record not found",
      });
    }

    const updateData = {};
    if (courseName) updateData.courseName = courseName;
    
    if (subjects && Array.isArray(subjects) && subjects.length > 0) {
      // Validate marks
      for (const sub of subjects) {
        if (!sub.subjectName || sub.marks === undefined || sub.marks < 0 || sub.marks > 100) {
          return res.status(400).json({
            success: false,
            message: "Each subject must have a subjectName and marks between 0 and 100",
          });
        }
      }
      updateData.subjects = subjects;
      
      // Re-calculate stats
      const stats = calculateResultStats(subjects);
      Object.assign(updateData, stats);
    }

    const result = await Result.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Result updated successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Result Record
export const deleteResult = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Result.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Result deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};