import { Attendance } from "../model/attendance.model.js";
import { Fee } from "../model/fee.model.js";
import { Result } from "../model/result.model.js";

export const getAttendanceReport = async (req, res) => {
  try {
    const { courseId } = req.query;
    const filter = courseId ? { courseId } : {};

    const attendance = await Attendance.find(filter);
    const present = attendance.filter(a => a.status === "Present").length;
    const total = attendance.length;
    const rate = total > 0 ? (present / total) * 100 : 0;

    res.status(200).json({
      success: true,
      reportType: "Attendance",
      summary: { totalLogs: total, present, absent: total - present, attendanceRate: `${rate.toFixed(2)}%` }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeeReport = async (req, res) => {
  try {
    const fees = await Fee.find();
    let totalBilled = 0;
    let paidCount = 0;
    let pendingCount = 0;

    fees.forEach(f => {
      totalBilled += f.feeAmount;
      if (f.feeStatus === "Paid") paidCount += 1;
      else pendingCount += 1;
    });

    res.status(200).json({
      success: true,
      reportType: "Finance",
      summary: { totalRecords: fees.length, totalBilled, paidInvoices: paidCount, pendingInvoices: pendingCount }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAcademicReport = async (req, res) => {
  try {
    const results = await Result.find();
    let totalScore = 0;
    let passCount = 0;

    results.forEach(r => {
      totalScore += r.percentage;
      if (r.resultStatus === "Pass") passCount += 1;
    });

    const averagePercent = results.length > 0 ? totalScore / results.length : 0;

    res.status(200).json({
      success: true,
      reportType: "Academic",
      summary: { totalEvaluations: results.length, averagePercentage: `${averagePercent.toFixed(2)}%`, passingStudents: passCount }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
