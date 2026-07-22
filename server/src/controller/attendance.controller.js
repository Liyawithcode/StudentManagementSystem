import mongoose from "mongoose";
import { Attendance } from "../model/attendance.model.js";
import { Student } from "../model/student.model.js";
import { Course } from "../model/course.model.js";

/**
 * Record Attendance (Supports single entry or batch list entry)
 */
export const recordAttendance = async (req, res) => {
  try {
    const { courseId, studentId, status, records, date } = req.body;
    const recordDate = date ? new Date(date) : new Date();

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    // Batch Recording
    if (records && Array.isArray(records)) {
      if (records.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Records array cannot be empty",
        });
      }

      // Check if all records are valid
      for (const rec of records) {
        if (!rec.studentId || !rec.status || !["Present", "Absent"].includes(rec.status)) {
          return res.status(400).json({
            success: false,
            message: "Each record must have a studentId and status ('Present' or 'Absent')",
          });
        }
      }

      const attendanceDocs = records.map((rec) => ({
        studentId: rec.studentId,
        courseId,
        status: rec.status,
        date: rec.date ? new Date(rec.date) : recordDate,
      }));

      // In real-world, we might want to update existing records for the same day or just insert
      // For this system, we will perform insertions
      const attendance = await Attendance.insertMany(attendanceDocs);

      return res.status(201).json({
        success: true,
        message: `${attendance.length} attendance records logged successfully`,
        attendance,
      });
    }

    // Single Recording
    if (!studentId || !status || !["Present", "Absent"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Please provide studentId, courseId and status ('Present' or 'Absent')",
      });
    }

    const attendance = await Attendance.create({
      studentId,
      courseId,
      status,
      date: recordDate,
    });


    res.status(201).json({
      success: true,
      message: "Attendance recorded successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Helper to enrich attendance records with student & course details
 */
const enrichAttendanceRecords = async (attendanceDocs) => {
  if (!attendanceDocs || attendanceDocs.length === 0) return [];
  const rawList = attendanceDocs.map((doc) => (doc.toObject ? doc.toObject() : doc));

  const studentIds = [...new Set(rawList.map((a) => a.studentId).filter(Boolean))];
  const courseIds = [...new Set(rawList.map((a) => a.courseId).filter(Boolean))];

  const validObjIds = studentIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
  const students = await Student.find({
    $or: [
      { _id: { $in: validObjIds } },
      { studentId: { $in: studentIds } },
      { id: { $in: studentIds } },
    ],
  }).lean();

  const validCourseObjIds = courseIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
  const courses = await Course.find({
    $or: [
      { _id: { $in: validCourseObjIds } },
      { courseCode: { $in: courseIds } },
      { code: { $in: courseIds } },
    ],
  }).lean();

  const studentMap = {};
  students.forEach((s) => {
    const fullName = `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.name || s.studentId;
    const assignedClass = s.class || s.department || 'Class 10';
    if (s._id) studentMap[s._id.toString()] = { name: fullName, customId: s.studentId, assignedClass };
    if (s.studentId) studentMap[s.studentId] = { name: fullName, customId: s.studentId, assignedClass };
    if (s.id) studentMap[s.id] = { name: fullName, customId: s.studentId, assignedClass };
  });

  const courseMap = {};
  courses.forEach((c) => {
    const cName = c.courseName || c.name || c.courseCode || c.code;
    if (c._id) courseMap[c._id.toString()] = cName;
    if (c.courseCode) courseMap[c.courseCode] = cName;
    if (c.code) courseMap[c.code] = cName;
  });

  return rawList.map((a) => {
    const sInfo = studentMap[a.studentId] || {};
    const cName = courseMap[a.courseId] || a.courseId;
    return {
      ...a,
      studentName: a.studentName || sInfo.name || 'Student Record',
      studentCustomId: sInfo.customId || a.studentId || 'N/A',
      assignedClass: a.assignedClass || sInfo.assignedClass || 'Class 10',
      courseName: cName,
    };
  });

};

/**
 * Get All Attendance records (for admin/faculty overview)
 */
export const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().sort({ createdAt: -1 });
    const enriched = await enrichAttendanceRecords(attendance);
    res.status(200).json({
      success: true,
      count: enriched.length,
      attendance: enriched,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Attendance for a specific student
 */
export const getStudentAttendance = async (req, res) => {
  try {
    const paramId = req.params.studentId || req.query.studentId;
    let matchIds = [];

    if (paramId) {
      matchIds.push(paramId);
      if (mongoose.Types.ObjectId.isValid(paramId)) {
        matchIds.push(paramId.toString());
      }
    }

    if (req.user) {
      if (req.user.studentId) matchIds.push(req.user.studentId);
      if (req.user._id) matchIds.push(req.user._id.toString());
      if (req.user.id) matchIds.push(req.user.id);
    }

    // Look up student document if paramId was provided
    if (paramId) {
      const studentDoc = await Student.findOne({
        $or: [
          { _id: mongoose.Types.ObjectId.isValid(paramId) ? paramId : null },
          { studentId: paramId },
          { id: paramId },
        ].filter(Boolean),
      }).lean();

      if (studentDoc) {
        if (studentDoc._id) matchIds.push(studentDoc._id.toString());
        if (studentDoc.studentId) matchIds.push(studentDoc.studentId);
        if (studentDoc.id) matchIds.push(studentDoc.id);
      }
    }

    matchIds = [...new Set(matchIds.filter(Boolean))];

    if (matchIds.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        attendance: [],
      });
    }

    const attendance = await Attendance.find({
      studentId: { $in: matchIds }
    }).sort({ createdAt: -1 });

    const enriched = await enrichAttendanceRecords(attendance);

    res.status(200).json({
      success: true,
      count: enriched.length,
      attendance: enriched,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/**
 * Get Attendance for a specific course
 */
export const getCourseAttendance = async (req, res) => {
  try {
    const courseId = req.params.courseId || req.query.courseId;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Please provide course ID",
      });
    }

    const attendance = await Attendance.find({
      $or: [{ courseId }, { courseId: String(courseId) }]
    }).sort({ createdAt: -1 });

    const enriched = await enrichAttendanceRecords(attendance);

    res.status(200).json({
      success: true,
      count: enriched.length,
      attendance: enriched,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



/**
 * Update an Attendance record by ID
 */
export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["Present", "Absent"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid status ('Present' or 'Absent')",
      });
    }

    const attendance = await Attendance.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
