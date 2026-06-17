let classes = [
  { id: "1", name: "Class 10", advisor: "Mr. John Doe" },
  { id: "2", name: "Class 11", advisor: "Ms. Sarah Smith" }
];

export const getClasses = async (req, res) => {
  res.status(200).json({ success: true, count: classes.length, classes });
};

export const createClass = async (req, res) => {
  const { name, advisor } = req.body;
  if (!name) return res.status(400).json({ success: false, message: "Class name is required" });

  const newClass = { id: String(classes.length + 1), name, advisor: advisor || "None" };
  classes.push(newClass);
  res.status(201).json({ success: true, message: "Class created successfully", class: newClass });
};

export const deleteClass = async (req, res) => {
  const { id } = req.params;
  classes = classes.filter(c => c.id !== id);
  res.status(200).json({ success: true, message: "Class deleted successfully" });
};
