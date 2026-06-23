import { Faculty } from "../model/faculty.model.js";

export const findFacultyByEmail = async (email, selectFields = "") => {
  let query = Faculty.findOne({ email });
  if (selectFields) {
    query = query.select(selectFields);
  }
  return await query;
};

export const findFacultyById = async (facultyId) => {
  return await Faculty.findOne({ facultyId });
};

export const createFaculty = async (facultyData) => {
  return await Faculty.create(facultyData);
};

export const findAllFaculties = async () => {
  return await Faculty.find();
};

export const updateFaculty = async (facultyId, updateData) => {
  return await Faculty.findOneAndUpdate(
    { facultyId },
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

export const deleteFaculty = async (facultyId) => {
  return await Faculty.findOneAndDelete({ facultyId });
};
