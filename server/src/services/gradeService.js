let gradingScale = [
  { grade: "A+", minPercentage: 90, description: "Excellent" },
  { grade: "A", minPercentage: 75, description: "Very Good" },
  { grade: "B", minPercentage: 60, description: "Good" },
  { grade: "C", minPercentage: 40, description: "Satisfactory" },
  { grade: "F", minPercentage: 0, description: "Fail" }
];

export const getGradingScaleList = async () => {
  return gradingScale;
};

export const setGradingScale = async (scale) => {
  gradingScale = scale;
  return gradingScale;
};
