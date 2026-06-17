let gradingScale = [
  { grade: "A+", minPercentage: 90, description: "Excellent" },
  { grade: "A", minPercentage: 75, description: "Very Good" },
  { grade: "B", minPercentage: 60, description: "Good" },
  { grade: "C", minPercentage: 40, description: "Satisfactory" },
  { grade: "F", minPercentage: 0, description: "Fail" }
];

export const getGradingScale = async (req, res) => {
  res.status(200).json({ success: true, scale: gradingScale });
};

export const updateGradingScale = async (req, res) => {
  const { scale } = req.body;
  if (!scale || !Array.isArray(scale)) {
    return res.status(400).json({ success: false, message: "Please provide a valid scale array" });
  }

  gradingScale = scale;
  res.status(200).json({ success: true, message: "Grading scale updated successfully", scale: gradingScale });
};
