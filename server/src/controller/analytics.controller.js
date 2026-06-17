import { Student } from "../model/student.model.js";
import { Result } from "../model/result.model.js";

export const getPerformanceAnalytics = async (req, res) => {
  try {
    const results = await Result.find();
    
    // Group grades counts
    const gradesCounts = { "A+": 0, "A": 0, "B": 0, "C": 0, "F": 0 };
    results.forEach(r => {
      if (gradesCounts[r.grade] !== undefined) {
        gradesCounts[r.grade] += 1;
      }
    });

    res.status(200).json({
      success: true,
      metrics: {
        totalEvaluated: results.length,
        gradesDistribution: gradesCounts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEnrollmentAnalytics = async (req, res) => {
  try {
    const active = await Student.countDocuments({ enrollmentStatus: "Active" });
    const inactive = await Student.countDocuments({ enrollmentStatus: "Inactive" });
    const suspended = await Student.countDocuments({ enrollmentStatus: "Suspended" });
    const graduated = await Student.countDocuments({ enrollmentStatus: "Graduated" });

    res.status(200).json({
      success: true,
      metrics: {
        totalStudents: active + inactive + suspended + graduated,
        active,
        inactive,
        suspended,
        graduated
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
