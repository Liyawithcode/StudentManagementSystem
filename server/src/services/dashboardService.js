import { Student } from "../model/student.model.js";
import { Faculty } from "../model/faculty.model.js";
import { Course } from "../model/course.model.js";
import { Book } from "../model/library.model.js";
import { RoomAllocation } from "../model/hostel.model.js";
import { Transport } from "../model/transport.model.js";

/**
 * Fetch counts statistics for the main dashboard.
 */
export const getStatsAggregation = async () => {
  const totalStudents = await Student.countDocuments();
  const totalFaculty = await Faculty.countDocuments();
  const totalCourses = await Course.countDocuments();
  const totalBooks = await Book.countDocuments();
  const totalRooms = await RoomAllocation.countDocuments();
  const totalRoutes = await Transport.countDocuments();

  return {
    students: totalStudents,
    faculty: totalFaculty,
    courses: totalCourses,
    libraryBooks: totalBooks,
    hostelRooms: totalRooms,
    transportRoutes: totalRoutes
  };
};
