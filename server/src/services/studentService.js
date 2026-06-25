import { Student } from "../model/student.model.js";
import { BaseService } from "./baseService.js";

const studentDb = new BaseService(Student);

export const findStudentByEmail = (email, selectFields = "") =>
  studentDb.findOne({ email }, selectFields);

export const findStudentById = (studentId) =>
  studentDb.findOne({ studentId });

export const createStudent = (studentData) =>
  studentDb.create(studentData);

export const findAllStudents = () =>
  studentDb.find();

export const updateStudent = (studentId, updateData) =>
  studentDb.findOneAndUpdate({ studentId }, updateData, { new: true, runValidators: true });

export const deleteStudent = (studentId) =>
  studentDb.findOneAndDelete({ studentId });
