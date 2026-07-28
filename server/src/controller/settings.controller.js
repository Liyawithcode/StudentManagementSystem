import { Settings } from "../model/settings.model.js";

let inMemorySettings = {
  schoolName: "Antigravity Academy of Sciences",
  tagline: "Excellence in Innovation & Learning",
  academicYear: "2026-2027",
  contactEmail: "admin@antigravityacademy.edu",
  phone: "+1 555-0199",
  address: "102 Education Lane, Academic City",
  website: "https://antigravityacademy.edu",
  gradingSystem: "Percentage",
  attendanceThreshold: 75,
  maxClassSize: 40,
  logoUrl: "",
  primaryColor: "#6366f1",
  enableEmailNotifications: true,
  enableSMSAlerts: false,
  maintenanceMode: false,
};

export const getSettings = async (req, res, next) => {
  try {
    let settings = null;
    try {
      settings = await Settings.findOne();
      if (!settings) {
        settings = await Settings.create(inMemorySettings);
      }
    } catch (dbErr) {
      // Fallback to in-memory store if DB query fails
      settings = inMemorySettings;
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const updates = req.body;
    let settings = null;

    try {
      settings = await Settings.findOne();
      if (settings) {
        Object.assign(settings, updates);
        await settings.save();
      } else {
        settings = await Settings.create({ ...inMemorySettings, ...updates });
      }
    } catch (dbErr) {
      // Fallback to in-memory store update
      inMemorySettings = { ...inMemorySettings, ...updates };
      settings = inMemorySettings;
    }

    res.status(200).json({
      success: true,
      message: "System settings updated successfully",
      settings,
    });
  } catch (error) {
    next(error);
  }
};
