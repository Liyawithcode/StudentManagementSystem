let assignments = [
  { id: "1", title: "Algebra Worksheet", courseCode: "MATH101", dueDate: "2026-06-20", description: "Complete exercises 1 to 10" }
];

export const getAssignments = async (req, res) => {
  res.status(200).json({ success: true, count: assignments.length, assignments });
};

export const createAssignment = async (req, res) => {
  const { title, courseCode, dueDate, description } = req.body;
  if (!title || !courseCode || !dueDate) {
    return res.status(400).json({ success: false, message: "Required: title, courseCode, dueDate" });
  }

  const newAssignment = { id: String(assignments.length + 1), title, courseCode, dueDate, description };
  assignments.push(newAssignment);
  res.status(201).json({ success: true, message: "Assignment created successfully", assignment: newAssignment });
};

export const deleteAssignment = async (req, res) => {
  const { id } = req.params;
  assignments = assignments.filter(a => a.id !== id);
  res.status(200).json({ success: true, message: "Assignment deleted successfully" });
};
