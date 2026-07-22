import { Result } from "../model/result.model.js";

export const enterMarks = async (req, res) => {
  try {
    const { studentId, courseName, subjectName, marks } = req.body;
    if (!studentId || !courseName || !subjectName || marks === undefined) {
      return res.status(400).json({ success: false, message: "Required fields: studentId, courseName, subjectName, marks" });
    }

    let result = await Result.findOne({ studentId, courseName });
    if (!result) {
      const percentage = marks;
      let grade = "F";
      if (percentage >= 90) grade = "A+";
      else if (percentage >= 75) grade = "A";
      else if (percentage >= 60) grade = "B";
      else if (percentage >= 40) grade = "C";

      result = new Result({
        studentId,
        courseName,
        subjects: [{ subjectName, marks }],
        totalMarks: 100,
        obtainedMarks: marks,
        percentage,
        grade,
        resultStatus: percentage >= 40 ? "Pass" : "Fail"
      });
    } else {
      // check if subject already exists
      const subIndex = result.subjects.findIndex(s => s.subjectName === subjectName);
      if (subIndex > -1) {
        result.subjects[subIndex].marks = marks;
      } else {
        result.subjects.push({ subjectName, marks });
      }

      // Re-calculate statistics
      let obtained = 0;
      result.subjects.forEach(s => obtained += s.marks);
      const total = result.subjects.length * 100;
      const percentage = (obtained / total) * 100;

      result.obtainedMarks = obtained;
      result.totalMarks = total;
      result.percentage = percentage;

      let grade = "F";
      if (percentage >= 90) grade = "A+";
      else if (percentage >= 75) grade = "A";
      else if (percentage >= 60) grade = "B";
      else if (percentage >= 40) grade = "C";

      result.grade = grade;
      result.resultStatus = percentage >= 40 ? "Pass" : "Fail";
    }

    await result.save();
    res.status(200).json({ success: true, message: "Marks recorded successfully", result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
