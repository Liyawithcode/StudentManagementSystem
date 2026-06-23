import { Faculty } from "../model/faculty.model.js";

/**
 * Fetch the salary of a faculty member.
 */
export const findFacultySalary = async (facultyId) => {
  const faculty = await Faculty.findOne({ facultyId });
  return faculty ? faculty.salary : null;
};

/**
 * Update the salary of a faculty member.
 */
export const updateFacultySalaryAmount = async (facultyId, salary) => {
  return await Faculty.findOneAndUpdate(
    { facultyId },
    { $set: { salary } },
    { new: true, runValidators: true }
  );
};
