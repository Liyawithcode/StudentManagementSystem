let systemSettings = {
  schoolName: "Grand Academy High School",
  contactEmail: "info@grandacademy.edu",
  phone: "+1 555-0199",
  address: "102 Education Lane, Academic City",
  academicYear: "2026-2027",
  logoUrl: "https://example.com/logo.png"
};

export const getSettings = async (req, res) => {
  res.status(200).json({ success: true, settings: systemSettings });
};

export const updateSettings = async (req, res) => {
  const updates = req.body;
  systemSettings = { ...systemSettings, ...updates };
  res.status(200).json({ success: true, message: "System settings updated successfully", settings: systemSettings });
};
