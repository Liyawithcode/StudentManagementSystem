export const calculateGrade = (percentage) => {
  if (isNaN(percentage)) return "F";
  if (percentage >= 90) return "A+";
  if (percentage >= 75) return "A";
  if (percentage >= 60) return "B";
  if (percentage >= 40) return "C";
  return "F";
};

export default calculateGrade;
