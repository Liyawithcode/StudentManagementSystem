import { Faculty } from "../model/faculty.model.js";
import { BaseService } from "./baseService.js";

const facultyDb = new BaseService(Faculty);

export const findFacultyByEmail = (email, selectFields = "") =>
  facultyDb.findOne({ email }, selectFields);

export const findFacultyById = (facultyId) =>
  facultyDb.findOne({ facultyId });

export const createFaculty = (facultyData) =>
  facultyDb.create(facultyData);

export const findAllFaculties = () =>
  facultyDb.find();

export const updateFaculty = (facultyId, updateData) =>
  facultyDb.findOneAndUpdate({ facultyId }, updateData, { new: true, runValidators: true });

export const deleteFaculty = (facultyId) =>
  facultyDb.findOneAndDelete({ facultyId });
