import { Result } from "../model/result.model.js";
import { calculateResultStats } from "../utils/index.js";

export { calculateResultStats };

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
