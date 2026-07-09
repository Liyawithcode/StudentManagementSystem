import mongoose from "mongoose";
import { Student } from "../model/student.model.js";
import { BaseService } from "./baseService.js";

const studentDb = new BaseService(Student);

export const findStudentByEmail = (email, selectFields = "") =>
  studentDb.findOne({ email }, selectFields);

export const findStudentById = (studentId) => {
  if (mongoose.Types.ObjectId.isValid(studentId)) {
    return studentDb.findOne({ _id: studentId });
  }
  return studentDb.findOne({ studentId });
};

export const createStudent = (studentData) =>
  studentDb.create(studentData);

export const findAllStudents = () =>
  studentDb.find();

export const updateStudent = (studentId, updateData) => {
  if (mongoose.Types.ObjectId.isValid(studentId)) {
    return studentDb.findOneAndUpdate({ _id: studentId }, updateData, { new: true, runValidators: true });
  }
  return studentDb.findOneAndUpdate({ studentId }, updateData, { new: true, runValidators: true });
};

export const deleteStudent = (studentId) => {
  if (mongoose.Types.ObjectId.isValid(studentId)) {
    return studentDb.findOneAndDelete({ _id: studentId });
  }
  return studentDb.findOneAndDelete({ studentId });
};
