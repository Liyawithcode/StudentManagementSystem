import { Course } from "../model/course.model.js";
import { BaseService } from "./baseService.js";

const courseDb = new BaseService(Course);

export const findCourseByCode = (courseCode) => courseDb.findOne({ courseCode });
export const createCourse = (courseData) => courseDb.create(courseData);
export const findAllCourses = () => courseDb.find();
export const updateCourse = (courseCode, updateData) =>
  courseDb.findOneAndUpdate({ courseCode }, updateData, { new: true, runValidators: true });
export const deleteCourse = (courseCode) => courseDb.findOneAndDelete({ courseCode });
