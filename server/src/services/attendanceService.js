import { Attendance } from "../model/attendance.model.js";

export const insertBatchAttendance = async (attendanceDocs) => {
  return await Attendance.insertMany(attendanceDocs);
};

export const createSingleAttendance = async (studentId, courseId, status) => {
  return await Attendance.create({ studentId, courseId, status });
};

export const findStudentAttendance = async (studentId) => {
  return await Attendance.find({ studentId });
};

export const findCourseAttendance = async (courseId) => {
  return await Attendance.find({ courseId });
};

export const updateAttendanceRecord = async (id, status) => {
  return await Attendance.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true, runValidators: true }
  );
};
