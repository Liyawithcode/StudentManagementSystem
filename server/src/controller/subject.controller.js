let subjects = [
  { id: "1", code: "MATH101", name: "Algebra I", credits: 4 },
  { id: "2", code: "SCI101", name: "Introductory Physics", credits: 4 }
];

export const getSubjects = async (req, res) => {
  res.status(200).json({ success: true, count: subjects.length, subjects });
};

export const createSubject = async (req, res) => {
  const { code, name, credits } = req.body;
  if (!code || !name) return res.status(400).json({ success: false, message: "Code and name are required" });

  const newSubject = { id: String(subjects.length + 1), code, name, credits: credits || 3 };
  subjects.push(newSubject);
  res.status(201).json({ success: true, message: "Subject created successfully", subject: newSubject });
};

export const deleteSubject = async (req, res) => {
  const { id } = req.params;
  subjects = subjects.filter(s => s.id !== id && s._id !== id);
  res.status(200).json({ success: true, message: "Subject deleted successfully" });
};

