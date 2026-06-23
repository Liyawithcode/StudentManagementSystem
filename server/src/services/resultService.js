import { Result } from "../model/result.model.js";

export const calculateResultStats = (subjects) => {
  let obtainedMarks = 0;
  const totalMarks = subjects.length * 100;

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

export const createResultRecord = async (studentId, courseName, subjects) => {
  const stats = calculateResultStats(subjects);
  return await Result.create({
    studentId,
    courseName,
    subjects,
    ...stats,
  });
};

export const findAllResultRecords = async () => {
  return await Result.find();
};

export const findResultByStudentId = async (studentId) => {
  return await Result.find({ studentId });
};

export const findResultById = async (id) => {
  return await Result.findById(id);
};

export const updateResultRecord = async (id, updateData) => {
  return await Result.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

export const deleteResultRecord = async (id) => {
  return await Result.findByIdAndDelete(id);
};
