import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      required: [true, "School name is required"],
      trim: true,
      default: "Antigravity Academy of Sciences",
    },
    tagline: {
      type: String,
      trim: true,
      default: "Excellence in Innovation & Learning",
    },
    academicYear: {
      type: String,
      required: [true, "Academic year is required"],
      trim: true,
      default: "2026-2027",
    },
    contactEmail: {
      type: String,
      required: [true, "Contact email is required"],
      trim: true,
      default: "admin@antigravityacademy.edu",
    },
    phone: {
      type: String,
      trim: true,
      default: "+1 555-0199",
    },
    address: {
      type: String,
      trim: true,
      default: "102 Education Lane, Academic City",
    },
    website: {
      type: String,
      trim: true,
      default: "https://antigravityacademy.edu",
    },
    gradingSystem: {
      type: String,
      enum: ["Percentage", "GPA 4.0", "GPA 10.0", "Letter Grade"],
      default: "Percentage",
    },
    attendanceThreshold: {
      type: Number,
      default: 75,
      min: 0,
      max: 100,
    },
    maxClassSize: {
      type: Number,
      default: 40,
      min: 1,
    },
    logoUrl: {
      type: String,
      default: "",
    },
    primaryColor: {
      type: String,
      default: "#6366f1",
    },
    enableEmailNotifications: {
      type: Boolean,
      default: true,
    },
    enableSMSAlerts: {
      type: Boolean,
      default: false,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Settings = mongoose.model("Settings", settingsSchema);
