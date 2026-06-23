import { Course } from "../model/course.model.js";

export const findCourseByCode = async (courseCode) => {
  return await Course.findOne({ courseCode });
};

export const createCourse = async (courseData) => {
  return await Course.create(courseData);
};

export const findAllCourses = async () => {
  return await Course.find();
};

export const updateCourse = async (courseCode, updateData) => {
  return await Course.findOneAndUpdate(
    { courseCode },
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

export const deleteCourse = async (courseCode) => {
  return await Course.findOneAndDelete({ courseCode });
};
