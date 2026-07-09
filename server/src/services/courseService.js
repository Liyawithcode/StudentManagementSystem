import mongoose from "mongoose";
import { Course } from "../model/course.model.js";
import { BaseService } from "./baseService.js";

const courseDb = new BaseService(Course);

export const findCourseByCode = (idOrCode) => {
  if (mongoose.Types.ObjectId.isValid(idOrCode)) {
    return courseDb.findOne({ _id: idOrCode });
  }
  return courseDb.findOne({ courseCode: idOrCode });
};

export const createCourse = (courseData) => courseDb.create(courseData);

export const findAllCourses = () => courseDb.find();

export const updateCourse = (idOrCode, updateData) => {
  if (mongoose.Types.ObjectId.isValid(idOrCode)) {
    return courseDb.findOneAndUpdate({ _id: idOrCode }, updateData, { new: true, runValidators: true });
  }
  return courseDb.findOneAndUpdate({ courseCode: idOrCode }, updateData, { new: true, runValidators: true });
};

export const deleteCourse = (idOrCode) => {
  if (mongoose.Types.ObjectId.isValid(idOrCode)) {
    return courseDb.findOneAndDelete({ _id: idOrCode });
  }
  return courseDb.findOneAndDelete({ courseCode: idOrCode });
};
