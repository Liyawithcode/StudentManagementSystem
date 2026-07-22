import mongoose from "mongoose";
import { Faculty } from "../model/faculty.model.js";
import { BaseService } from "./baseService.js";

const facultyDb = new BaseService(Faculty);

export const findFacultyByEmail = (email, selectFields = "") =>
  facultyDb.findOne({ email }, selectFields);

export const findFacultyById = async (facultyId) => {
  let faculty;
  if (mongoose.Types.ObjectId.isValid(facultyId)) {
    faculty = await facultyDb.findOne({ _id: facultyId });
  }
  if (!faculty) {
    faculty = await facultyDb.findOne({ facultyId });
  }
  if (!faculty) {
    faculty = await facultyDb.findOne({ id: facultyId });
  }
  return faculty;
};

export const createFaculty = (facultyData) =>
  facultyDb.create(facultyData);

export const findAllFaculties = () =>
  facultyDb.find();

export const updateFaculty = async (facultyId, updateData) => {
  let faculty;
  if (mongoose.Types.ObjectId.isValid(facultyId)) {
    faculty = await facultyDb.findOneAndUpdate({ _id: facultyId }, updateData, { new: true, runValidators: true });
  }
  if (!faculty) {
    faculty = await facultyDb.findOneAndUpdate({ facultyId }, updateData, { new: true, runValidators: true });
  }
  if (!faculty) {
    faculty = await facultyDb.findOneAndUpdate({ id: facultyId }, updateData, { new: true, runValidators: true });
  }
  return faculty;
};

import { User } from "../model/user.model.js";

export const deleteFaculty = async (facultyId) => {
  let deletedFaculty;
  if (mongoose.Types.ObjectId.isValid(facultyId)) {
    deletedFaculty = await facultyDb.findOneAndDelete({ _id: facultyId });
  }
  if (!deletedFaculty) {
    deletedFaculty = await facultyDb.findOneAndDelete({ facultyId });
  }
  if (!deletedFaculty) {
    deletedFaculty = await facultyDb.findOneAndDelete({ id: facultyId });
  }

  if (deletedFaculty && deletedFaculty.email) {
    try {
      await User.findOneAndDelete({ email: deletedFaculty.email });
    } catch (err) {
      console.warn("Cascade cleanup error for faculty deletion:", err.message);
    }
  }

  return deletedFaculty;
};


