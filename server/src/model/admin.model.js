import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    adminid: {
      type: String,
      required: [true, "Admin ID is required"],
      unique: true,
      trim: true,
      default: ""
    },
    adminfullname: {
      type: String,
      required: [true, "Admin Full name is required"],
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
      select: false, 
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
    phone: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
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



export const Admin = mongoose.model("Admin", adminSchema);
