import mongoose from "mongoose";
import { Student } from "../model/student.model.js";
import { BaseService } from "./baseService.js";

const studentDb = new BaseService(Student);

export const findStudentByEmail = (email, selectFields = "") =>
  studentDb.findOne({ email }, selectFields);

export const findStudentById = async (studentId) => {
  let student;
  if (mongoose.Types.ObjectId.isValid(studentId)) {
    student = await studentDb.findOne({ _id: studentId });
  }
  if (!student) {
    student = await studentDb.findOne({ studentId });
  }
  if (!student) {
    student = await studentDb.findOne({ id: studentId });
  }
  return student;
};

export const createStudent = (studentData) =>
  studentDb.create(studentData);

export const findAllStudents = () =>
  studentDb.find();

export const updateStudent = async (studentId, updateData) => {
  let student;
  if (mongoose.Types.ObjectId.isValid(studentId)) {
    student = await studentDb.findOneAndUpdate({ _id: studentId }, updateData, { new: true, runValidators: true });
  }
  if (!student) {
    student = await studentDb.findOneAndUpdate({ studentId }, updateData, { new: true, runValidators: true });
  }
  if (!student) {
    student = await studentDb.findOneAndUpdate({ id: studentId }, updateData, { new: true, runValidators: true });
  }
  return student;
};

import { User } from "../model/user.model.js";
import { RoomAllocation } from "../model/hostel.model.js";

export const deleteStudent = async (studentId) => {
  let deletedStudent;
  if (mongoose.Types.ObjectId.isValid(studentId)) {
    deletedStudent = await studentDb.findOneAndDelete({ _id: studentId });
  }
  if (!deletedStudent) {
    deletedStudent = await studentDb.findOneAndDelete({ studentId });
  }
  if (!deletedStudent) {
    deletedStudent = await studentDb.findOneAndDelete({ id: studentId });
  }

  if (deletedStudent) {
    try {
      // Cascade cleanup User account with matching email if present
      if (deletedStudent.email) {
        await User.findOneAndDelete({ email: deletedStudent.email });
      }
      // Vacate any hostel room allocated to this student
      if (deletedStudent.studentId) {
        await RoomAllocation.updateMany(
          { studentId: deletedStudent.studentId },
          { $set: { status: "Available", studentId: null } }
        );
      }
    } catch (err) {
      console.warn("Cascade cleanup error for student deletion:", err.message);
    }
  }

  return deletedStudent;
};


