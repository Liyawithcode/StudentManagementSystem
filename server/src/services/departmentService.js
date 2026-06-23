import { Course } from "../model/course.model.js";

const STATIC_DEPARTMENTS = [
  "Computer Science & Engineering",
  "Electrical & Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Information Technology",
  "Business Administration",
  "Mathematics & Sciences",
  "Humanities",
];

/**
 * Get all unique departments currently registered in courses, or return standard fallbacks.
 */
export const getUniqueDepartments = async () => {
  try {
    const courses = await Course.find();
    const departments = courses
      .map((c) => c.department)
      .filter((dept, index, self) => dept && self.indexOf(dept) === index);
    return departments.length > 0 ? departments : STATIC_DEPARTMENTS;
  } catch (error) {
    return STATIC_DEPARTMENTS;
  }
};
