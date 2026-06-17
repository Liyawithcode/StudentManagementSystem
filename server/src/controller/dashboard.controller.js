import { Student } from "../model/student.model.js";
import { Faculty } from "../model/faculty.model.js";
import { Course } from "../model/course.model.js";
import { Fee } from "../model/fee.model.js";
import { Book } from "../model/library.model.js";
import { RoomAllocation } from "../model/hostel.model.js";
import { Transport } from "../model/transport.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalFaculty = await Faculty.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalBooks = await Book.countDocuments();
    const totalRooms = await RoomAllocation.countDocuments();
    const totalRoutes = await Transport.countDocuments();
    
    const pendingFees = await Fee.countDocuments({ feeStatus: { $in: ["pending", "Partial"] } });

    res.status(200).json({
      success: true,
      stats: {
        students: totalStudents,
        faculty: totalFaculty,
        courses: totalCourses,
        libraryBooks: totalBooks,
        hostelRooms: totalRooms,
        transportRoutes: totalRoutes,
        unpaidFeesInvoices: pendingFees
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
