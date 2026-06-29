export const calculateGrade = (percentage) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 75) return "A";
  if (percentage >= 60) return "B";
  if (percentage >= 40) return "C";
  return "F";
};

export const calculateResultStatus = (percentage) => {
  return percentage >= 40 ? "Pass" : "Fail";
};

export const calculateGPA = (grade) => {
  switch (grade) {
    case "A+": return 4.0;
    case "A": return 4.0;
    case "B": return 3.0;
    case "C": return 2.0;
    case "F": return 0.0;
    default: return 0.0;
  }
};

export const calculateResultStats = (subjects) => {
  let obtainedMarks = 0;
  const totalMarks = subjects.length * 100;

  subjects.forEach((sub) => {
    obtainedMarks += sub.marks;
  });

  const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
  const grade = calculateGrade(percentage);
  const resultStatus = calculateResultStatus(percentage);

  return {
    totalMarks,
    obtainedMarks,
    percentage,
    grade,
    resultStatus,
  };
};

export default {
  calculateGrade,
  calculateResultStatus,
  calculateGPA,
  calculateResultStats,
};
