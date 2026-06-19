import express from "express";
import { createCourse, getAllCourses, getCourseByCode, updateCourse, deleteCourse } from "../controller/course.controller.js";
import { getAssignments, createAssignment, deleteAssignment } from "../controller/assignment.controller.js";
import { getHomeworks, createHomework, deleteHomework } from "../controller/homework.controller.js";
import { getBatches, createBatch, deleteBatch } from "../controller/batch.controller.js";
import { getClasses, createClass, deleteClass } from "../controller/class.controller.js";
import { getSections, createSection, deleteSection } from "../controller/section.controller.js";
import { getSubjects, createSubject, deleteSubject } from "../controller/subject.controller.js";
import { createTimetable, getTimetableByClass, deleteTimetable } from "../controller/timetable.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

export const courseRouter = express.Router();

courseRouter.use(protect);

// Courses routes
courseRouter.route("/")
    .get(getAllCourses)
    .post(restrictTo("admin"), createCourse);

courseRouter.get("/code/:code", getCourseByCode);

courseRouter.route("/:id")
    .put(restrictTo("admin"), updateCourse)
    .delete(restrictTo("admin"), deleteCourse);

// Assignments routes
courseRouter.route("/assignments")
    .get(getAssignments)
    .post(restrictTo("faculty", "admin"), createAssignment);

courseRouter.delete("/assignments/:id", restrictTo("faculty", "admin"), deleteAssignment);

// Homeworks routes
courseRouter.route("/homeworks")
    .get(getHomeworks)
    .post(restrictTo("faculty", "admin"), createHomework);

courseRouter.delete("/homeworks/:id", restrictTo("faculty", "admin"), deleteHomework);

// Batches routes
courseRouter.route("/batches")
    .get(getBatches)
    .post(restrictTo("admin"), createBatch);

courseRouter.delete("/batches/:id", restrictTo("admin"), deleteBatch);

// Classes routes
courseRouter.route("/classes")
    .get(getClasses)
    .post(restrictTo("admin"), createClass);

courseRouter.delete("/classes/:id", restrictTo("admin"), deleteClass);

// Sections routes
courseRouter.route("/sections")
    .get(getSections)
    .post(restrictTo("admin"), createSection);

courseRouter.delete("/sections/:id", restrictTo("admin"), deleteSection);

// Subjects routes
courseRouter.route("/subjects")
    .get(getSubjects)
    .post(restrictTo("admin"), createSubject);

courseRouter.delete("/subjects/:id", restrictTo("admin"), deleteSubject);

// Timetable routes
courseRouter.route("/timetable")
    .get(getTimetableByClass)
    .post(restrictTo("admin"), createTimetable);

courseRouter.delete("/timetable/:id", restrictTo("admin"), deleteTimetable);
