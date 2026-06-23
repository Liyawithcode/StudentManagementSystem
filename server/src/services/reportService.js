import { Attendance } from "../model/attendance.model.js";
import { Fee } from "../model/fee.model.js";
import { Result } from "../model/result.model.js";
import { Student } from "../model/student.model.js";

export const generateAttendanceSummary = async (courseId) => {
  const filter = courseId ? { courseId } : {};
  const attendance = await Attendance.find(filter);
  const present = attendance.filter((a) => a.status === "Present").length;
  const total = attendance.length;
  const rate = total > 0 ? (present / total) * 100 : 0;

  return {
    totalLogs: total,
    present,
    absent: total - present,
    attendanceRate: `${rate.toFixed(2)}%`,
  };
};

export const generateFeeSummary = async () => {
  const fees = await Fee.find();
  let totalBilled = 0;
  let paidCount = 0;
  let pendingCount = 0;

  fees.forEach((f) => {
    totalBilled += f.feeAmount;
    if (f.feeStatus === "Paid") paidCount += 1;
    else pendingCount += 1;
  });

  return {
    totalRecords: fees.length,
    totalBilled,
    paidInvoices: paidCount,
    pendingInvoices: pendingCount,
  };
};

export const generateAcademicSummary = async () => {
  const results = await Result.find();
  let totalScore = 0;
  let passCount = 0;

  results.forEach((r) => {
    totalScore += r.percentage;
    if (r.resultStatus === "Pass") passCount += 1;
  });

  const averagePercent = results.length > 0 ? totalScore / results.length : 0;

  return {
    totalEvaluations: results.length,
    averagePercentage: `${averagePercent.toFixed(2)}%`,
    passingStudents: passCount,
  };
};

export const generatePerformanceMetrics = async () => {
  const results = await Result.find();
  const gradesCounts = { "A+": 0, A: 0, B: 0, C: 0, F: 0 };
  results.forEach((r) => {
    if (gradesCounts[r.grade] !== undefined) {
      gradesCounts[r.grade] += 1;
    }
  });

  return {
    totalEvaluated: results.length,
    gradesDistribution: gradesCounts,
  };
};

export const generateEnrollmentMetrics = async () => {
  const active = await Student.countDocuments({ enrollmentStatus: "Active" });
  const inactive = await Student.countDocuments({ enrollmentStatus: "Inactive" });
  const suspended = await Student.countDocuments({ enrollmentStatus: "Suspended" });
  const graduated = await Student.countDocuments({ enrollmentStatus: "Graduated" });

  return {
    totalStudents: active + inactive + suspended + graduated,
    active,
    inactive,
    suspended,
    graduated,
  };
};
