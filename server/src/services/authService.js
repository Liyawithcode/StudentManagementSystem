import { Admin } from "../model/admin.model.js";
import { Faculty } from "../model/faculty.model.js";
import { Student } from "../model/student.model.js";
import { User } from "../model/user.model.js";

/**
 * Generate a 6-digit numeric OTP.
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Look up a user by email across Admin, Faculty, Student, and User schemas.
 */
export const findUserByEmail = async (email) => {
  // Check Admin
  let user = await Admin.findOne({ email }).select("+password +verifyOtp +verifyOtpExpire");
  if (user) return { user, role: "admin" };

  // Check Faculty
  user = await Faculty.findOne({ email }).select("+password +verifyOtp +verifyOtpExpire");
  if (user) return { user, role: "faculty" };

  // Check Student
  user = await Student.findOne({ email }).select("+password +verifyOtp +verifyOtpExpire");
  if (user) return { user, role: "student" };

  // Check generic User
  user = await User.findOne({ email }).select("+password");
  if (user) return { user, role: user.role || "user" };

  return null;
};
