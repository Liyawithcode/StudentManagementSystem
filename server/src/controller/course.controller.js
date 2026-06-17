import { Course } from "../model/course.model.js";

// Create Course
export const createCourse = async (req, res) => {
  try {
    const { courseCode, courseName, department, credits } = req.body;

    if (!courseCode || !courseName || !department || credits === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields: courseCode, courseName, department, credits",
      });
    }

    const existingCourse = await Course.findOne({ courseCode });
    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: "Course already exists with this code",
      });
    }

    const course = await Course.create({
      courseCode,
      courseName,
      department,
      credits,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Course by Code
export const getCourseByCode = async (req, res) => {
  try {
    const courseCode = req.params.courseCode || req.body.courseCode || req.query.courseCode;

    if (!courseCode) {
      return res.status(400).json({
        success: false,
        message: "Please provide course code",
      });
    }

    const course = await Course.findOne({ courseCode });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Course
export const updateCourse = async (req, res) => {
  try {
    const courseCode = req.params.courseCode || req.body.courseCode;

    if (!courseCode) {
      return res.status(400).json({
        success: false,
        message: "Please provide course code",
      });
    }

    const { courseCode: newCode, ...updateData } = req.body;

    const course = await Course.findOneAndUpdate(
      { courseCode },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Course
export const deleteCourse = async (req, res) => {
  try {
    const courseCode = req.params.courseCode || req.body.courseCode;

    if (!courseCode) {
      return res.status(400).json({
        success: false,
        message: "Please provide course code",
      });
    }

    const course = await Course.findOneAndDelete({ courseCode });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
