import { Result } from "../model/result.model.js";
import { calculateResultStats } from "../utils/index.js";

/**
 * Record and aggregate marks for a specific student, course, and subject.
 */
export const recordMarks = async (studentId, courseName, subjectName, marks) => {
  let result = await Result.findOne({ studentId, courseName });

  if (!result) {
    const subjects = [{ subjectName, marks }];
    const stats = calculateResultStats(subjects);

    result = new Result({
      studentId,
      courseName,
      subjects,
      ...stats
    });
  } else {
    const subIndex = result.subjects.findIndex(s => s.subjectName === subjectName);
    if (subIndex > -1) {
      result.subjects[subIndex].marks = marks;
    } else {
      result.subjects.push({ subjectName, marks });
    }

    const stats = calculateResultStats(result.subjects);

    result.obtainedMarks = stats.obtainedMarks;
    result.totalMarks = stats.totalMarks;
    result.percentage = stats.percentage;
    result.grade = stats.grade;
    result.resultStatus = stats.resultStatus;
  }

  return await result.save();
};
