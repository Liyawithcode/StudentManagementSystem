import { Student } from "../model/student.model.js";

export const findStudentByEmail = async (email, selectFields = "") => {
  let query = Student.findOne({ email });
  if (selectFields) {
    query = query.select(selectFields);
  }
  return await query;
};

export const findStudentById = async (studentId) => {
  return await Student.findOne({ studentId });
};

export const createStudent = async (studentData) => {
  return await Student.create(studentData);
};

export const findAllStudents = async () => {
  return await Student.find();
};

export const updateStudent = async (studentId, updateData) => {
  return await Student.findOneAndUpdate(
    { studentId },
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

export const deleteStudent = async (studentId) => {
  return await Student.findOneAndDelete({ studentId });
};
