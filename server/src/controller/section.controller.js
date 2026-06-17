let sections = [
  { id: "1", name: "Section A", room: "Room 101" },
  { id: "2", name: "Section B", room: "Room 102" }
];

export const getSections = async (req, res) => {
  res.status(200).json({ success: true, count: sections.length, sections });
};

export const createSection = async (req, res) => {
  const { name, room } = req.body;
  if (!name) return res.status(400).json({ success: false, message: "Section name is required" });

  const newSection = { id: String(sections.length + 1), name, room: room || "N/A" };
  sections.push(newSection);
  res.status(201).json({ success: true, message: "Section created successfully", section: newSection });
};

export const deleteSection = async (req, res) => {
  const { id } = req.params;
  sections = sections.filter(s => s.id !== id);
  res.status(200).json({ success: true, message: "Section deleted successfully" });
};
