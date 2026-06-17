import { Attendance } from "../model/attendance.model.js";

/**
 * Record Attendance (Supports single entry or batch list entry)
 */
export const recordAttendance = async (req, res) => {
  try {
    const { courseId, studentId, status, records } = req.body;

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
 * Get Attendance for a specific student
 */
export const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.query.studentId;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Please provide student ID",
      });
    }

    const attendance = await Attendance.find({ studentId });

    res.status(200).json({
      success: true,
      count: attendance.length,
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

    const attendance = await Attendance.find({ courseId });

    res.status(200).json({
      success: true,
      count: attendance.length,
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
