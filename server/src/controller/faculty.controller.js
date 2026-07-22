import * as teacherService from "../services/teacherService.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, config_ENV } from "../config/auth.config.js";
import { generateOTP, sendVerificationOtp, generateFacultyId } from "../utils/index.js";

// Register Faculty
export const registerFaculty = async (req, res) => {
  try {
    let { email, password, facultyId, firstName, lastName, facultyfullname, department, qualification, salary, ...facultyData } = req.body;

    // Handle parsing of facultyfullname if firstName/lastName not provided directly
    if ((!firstName || !lastName) && facultyfullname) {
      const parts = facultyfullname.trim().split(/\s+/);
      firstName = firstName || parts[0] || "Faculty";
      lastName = lastName || parts.slice(1).join(" ") || "Member";
    }

    // Set defaults if not provided
    firstName = firstName || "Faculty";
    lastName = lastName || "Member";
    department = department || "General";
    qualification = qualification || "Not Specified";
    if (salary === undefined || salary === null) {
      salary = 0;
    }

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields: email and password",
      });
    }

    const existingFaculty = await teacherService.findFacultyByEmail(email);
    if (existingFaculty) {
      return res.status(400).json({
        success: false,
        message: "Faculty member already exists with this email",
      });
    }

    // Generate custom facultyId if not provided
    const finalFacultyId = facultyId || generateFacultyId();
    const existingFacultyId = await teacherService.findFacultyById(finalFacultyId);
    if (existingFacultyId) {
      return res.status(400).json({
        success: false,
        message: "Generated Faculty ID already exists, please try again",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const faculty = await teacherService.createFaculty({
      ...facultyData,
      facultyId: finalFacultyId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      department,
      qualification,
      salary,
      verifyOtp: otp,
      verifyOtpExpire: otpExpire,
      isVerified: false,
    });

    // Send email verification OTP
    await sendVerificationOtp(email, otp);

    const accessToken = generateAccessToken(faculty);
    const refreshToken = generateRefreshToken(faculty);

    res.cookie("refreshToken", refreshToken, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    const facultyResponse = faculty.toObject();
    delete facultyResponse.password;
    delete facultyResponse.verifyOtp;
    delete facultyResponse.verifyOtpExpire;

    res.status(201).json({
      success: true,
      message: "Faculty registered successfully. Verification OTP sent to email.",
      faculty: facultyResponse,
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login Faculty
export const loginFaculty = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const faculty = await teacherService.findFacultyByEmail(email, "+password");

    if (!faculty) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, faculty.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = generateAccessToken(faculty);
    const refreshToken = generateRefreshToken(faculty);

    res.cookie("refreshToken", refreshToken, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    const facultyResponse = faculty.toObject();
    delete facultyResponse.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      faculty: facultyResponse,
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Faculty members
export const getAllFaculties = async (req, res) => {
  try {
    const faculties = await teacherService.findAllFaculties();

    res.status(200).json({
      success: true,
      faculties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Faculty details by facultyId
export const getFacultyById = async (req, res) => {
  try {
    const facultyId = req.params.facultyId || req.body.facultyId || req.query.facultyId;

    if (!facultyId) {
      return res.status(400).json({
        success: false,
        message: "Please provide faculty ID",
      });
    }

    const faculty = await teacherService.findFacultyById(facultyId);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty member not found",
      });
    }

    res.status(200).json({
      success: true,
      faculty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Current Faculty Profile
export const getProfile = async (req, res) => {
  try {
    const facultyObj = req.user.toObject();
    delete facultyObj.password;

    res.status(200).json({
      success: true,
      faculty: facultyObj,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Faculty member
export const updateFaculty = async (req, res) => {
  try {
    // If updating own profile, use req.user.facultyId
    const facultyId = req.params.facultyId || req.body.facultyId || (req.user && req.user.role === 'faculty' ? req.user.facultyId : null);

    if (!facultyId) {
      return res.status(400).json({
        success: false,
        message: "Please provide faculty ID",
      });
    }

    const { email, password, role, isVerified, facultyfullname, ...updateData } = req.body;

    if (facultyfullname) {
      const parts = facultyfullname.trim().split(/\s+/);
      updateData.firstName = parts[0] || "Faculty";
      updateData.lastName = parts.slice(1).join(" ") || "Member";
    }

    const faculty = await teacherService.updateFaculty(facultyId, updateData);


    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty member not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Faculty profile updated successfully",
      faculty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Faculty member
export const deleteFaculty = async (req, res) => {
  try {
    const facultyId = req.params.facultyId || req.body.facultyId;

    if (!facultyId) {
      return res.status(400).json({
        success: false,
        message: "Please provide faculty ID",
      });
    }

    const faculty = await teacherService.deleteFaculty(facultyId);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty member not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Faculty member deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
