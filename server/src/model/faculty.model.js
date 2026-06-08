import mongoose from "mongoose";

const facultySchema = new mongoose.Schema(
  {
    facultyId: {
      type: String,
      required: [true, "Faculty ID / Employee ID is required"],
      unique: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Prevents returning the password in queries by default
    },
    role: {
      type: String,
      enum: ["faculty", "admin"],
      default: "faculty",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    dateOfBirth: {
      type: Date,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    qualification: {
      type: String,
      required: true,
      trim: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    subjects: [
      {
        type: String,
      },
    ],

    experience: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Retired", "Resigned"],
      default: "Active",
    },
    profileImage: {
      type: String,
      default: "",
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
      select: false,
    },
    verifyOtp: {
      type: String,
      default: "",
      select: false,
    },
    verifyOtpExpire: {
      type: Date,
      default: null,
      select: false,
    }
  },
  {
    timestamps: true,
  }
);



export const Faculty = mongoose.model("Faculty", facultySchema);
