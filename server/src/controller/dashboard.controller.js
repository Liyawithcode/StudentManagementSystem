import { Student } from "../model/student.model.js";
import { Faculty } from "../model/faculty.model.js";
import { Course } from "../model/course.model.js";
import { Fee } from "../model/fee.model.js";
import { Book, BookIssue } from "../model/library.model.js";
import { RoomAllocation } from "../model/hostel.model.js";
import { Transport } from "../model/transport.model.js";
import { Leave } from "../model/leave.model.js";
import { Timetable } from "../model/timetable.model.js";
import { Attendance } from "../model/attendance.model.js";
import { Result } from "../model/result.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const role = req.user?.role || "admin";

    if (role === "admin") {
      const totalStudents = await Student.countDocuments();
      const totalFaculty = await Faculty.countDocuments();
      const totalCourses = await Course.countDocuments();
      const totalBooks = await Book.countDocuments();
      const totalRooms = await RoomAllocation.countDocuments();
      const totalRoutes = await Transport.countDocuments();
      
      const pendingFees = await Fee.countDocuments({ feeStatus: { $in: ["pending", "Partial"] } });

      return res.status(200).json({
        success: true,
        role: "admin",
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
    }

    if (role === "student") {
      const studentIdentifier = req.user.studentId || req.user._id.toString();

      // 1. Attendance Rate
      const totalAttendance = await Attendance.countDocuments({ studentId: studentIdentifier });
      const presentAttendance = await Attendance.countDocuments({ studentId: studentIdentifier, status: "Present" });
      const attendanceRate = totalAttendance > 0 ? ((presentAttendance / totalAttendance) * 100).toFixed(1) : "0.0";

      // 2. Academic Performance
      const results = await Result.find({ studentId: studentIdentifier });
      const performance = results.length > 0 ? (results.reduce((sum, r) => sum + r.percentage, 0) / results.length).toFixed(1) : "0.0";

      // 3. Enrolled Courses
      let studentCourses = await Course.countDocuments({ department: req.user.department });
      if (studentCourses === 0) {
        studentCourses = await Course.countDocuments();
      }

      // 4. Pending Fees
      const pendingFeesList = await Fee.find({ studentId: studentIdentifier, feeStatus: { $in: ["pending", "Partial"] } });
      const unpaidInvoicesCount = pendingFeesList.length;
      const pendingFeesSum = pendingFeesList.reduce((sum, fee) => sum + fee.feeAmount, 0);

      // 5. Library Books Issued
      const issuedBooks = await BookIssue.countDocuments({ studentId: studentIdentifier, status: "Issued" });

      // 6. Hostel Room
      const roomAlloc = await RoomAllocation.findOne({ studentId: studentIdentifier });
      const roomInfo = roomAlloc ? `${roomAlloc.block} - Room ${roomAlloc.roomNumber}` : "Not Allocated";

      // 7. Transport Route
      const transportRoute = await Transport.findOne({ studentIds: studentIdentifier });
      const transportInfo = transportRoute ? `Route ${transportRoute.routeNumber} (${transportRoute.vehicleNumber})` : "Not Assigned";

      return res.status(200).json({
        success: true,
        role: "student",
        stats: {
          attendanceRate,
          performance,
          courses: studentCourses || 4,
          unpaidFeesInvoices: unpaidInvoicesCount,
          pendingFeesAmount: pendingFeesSum,
          libraryBooks: issuedBooks,
          hostelRooms: roomInfo,
          transportRoutes: transportInfo
        }
      });
    }

    if (role === "faculty") {
      const facultyIdentifier = req.user.facultyId || req.user._id.toString();

      // 1. Assigned Subjects
      const subjectsCount = req.user.subjects ? req.user.subjects.length : 0;

      // 2. Weekly Lectures
      const weeklyClasses = await Timetable.countDocuments({ facultyId: facultyIdentifier });

      // 3. Total Students in Department
      const departmentStudents = await Student.countDocuments({ department: req.user.department });

      // 4. Pending Leaves
      const pendingLeaves = await Leave.countDocuments({ applicantId: facultyIdentifier, applicantType: "Faculty", status: "pending" });

      // 5. Global metrics for Info
      const totalBooks = await Book.countDocuments();
      const totalRooms = await RoomAllocation.countDocuments();
      const totalRoutes = await Transport.countDocuments();

      return res.status(200).json({
        success: true,
        role: "faculty",
        stats: {
          subjects: subjectsCount,
          weeklyClasses,
          students: departmentStudents,
          pendingLeaves,
          libraryBooks: totalBooks,
          hostelRooms: totalRooms,
          transportRoutes: totalRoutes
        }
      });
    }

    return res.status(200).json({
      success: true,
      role: "user",
      stats: {
        students: 0,
        faculty: 0,
        courses: 0,
        libraryBooks: 0,
        hostelRooms: 0,
        transportRoutes: 0,
        unpaidFeesInvoices: 0
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPublicStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalFaculty = await Faculty.countDocuments();
    const totalCourses = await Course.countDocuments();

    // Success Rate (e.g. percentage of passed results in Result collection, defaulting to 98% if no results)
    const totalResults = await Result.countDocuments();
    const passedResults = await Result.countDocuments({ resultStatus: "Pass" });
    const successRate = totalResults > 0 ? Math.round((passedResults / totalResults) * 100) : 98;

    res.status(200).json({
      success: true,
      stats: {
        students: totalStudents,
        faculty: totalFaculty,
        courses: totalCourses,
        successRate: `${successRate}%`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
