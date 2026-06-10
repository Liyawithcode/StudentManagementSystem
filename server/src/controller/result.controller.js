import Result from "../model/result.model.js";

export const addResult = async (req, res) => {
  try {
    // const addresult = req.body;
    const { student, examName, subjects } = req.body;

    // calculate total marks
    let total = 0;

    subjects.forEach((sub) => {
      total += sub.marks;

      if (sub.marks >= 90) {
        sub.grade = "A+"
      }
      else if (sub.marks >= 75) {
        sub.grade = "A"
      }
      else if (sub.marks >= 60) {
        sub.grade = "B"
      }
      else if (sub.marks >= 40) {
        sub.grade = "C"
      }
      else {
        sub.grade = "F"
      }
    });

    const percentage = total / subjects.length;

    const resultStatus = percentage >= 40 ? "PASS" : "FAIL";

    const result = await Result.create({
      student,
      examName,
      subjects,
      totalMarks: total,
      percentage,
      resultStatus,
    });

    res.status(201).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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

export const getResultById = async (req, res) => {
  try {
    const student = req.body;
    const result = await Result.findOne({ student });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateResult = async (req, res) => {
  try {
    const student = req.body;
    const result = await Result.findOneAndUpdate({ student }, req.body, { new: true });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

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

export const deleteResult = async (req, res) => {
  try {
    const student = req.body;
    const result = await Result.findOneAndDelete({ student });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
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