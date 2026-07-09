import mongoose from "mongoose";
import { Faculty } from "../model/faculty.model.js";
import { BaseService } from "./baseService.js";

const facultyDb = new BaseService(Faculty);

export const findFacultyByEmail = (email, selectFields = "") =>
  facultyDb.findOne({ email }, selectFields);

export const findFacultyById = (facultyId) => {
  if (mongoose.Types.ObjectId.isValid(facultyId)) {
    return facultyDb.findOne({ _id: facultyId });
  }
  return facultyDb.findOne({ facultyId });
};

export const createFaculty = (facultyData) =>
  facultyDb.create(facultyData);

export const findAllFaculties = () =>
  facultyDb.find();

export const updateFaculty = (facultyId, updateData) => {
  if (mongoose.Types.ObjectId.isValid(facultyId)) {
    return facultyDb.findOneAndUpdate({ _id: facultyId }, updateData, { new: true, runValidators: true });
  }
  return facultyDb.findOneAndUpdate({ facultyId }, updateData, { new: true, runValidators: true });
};

export const deleteFaculty = (facultyId) => {
  if (mongoose.Types.ObjectId.isValid(facultyId)) {
    return facultyDb.findOneAndDelete({ _id: facultyId });
  }
  return facultyDb.findOneAndDelete({ facultyId });
};
