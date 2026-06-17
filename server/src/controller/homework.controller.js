let homeworks = [
  { id: "1", title: "Read Chapter 3", subject: "History", dateAssigned: "2026-06-10", description: "Answer review questions at the end of the chapter" }
];

export const getHomeworks = async (req, res) => {
  res.status(200).json({ success: true, count: homeworks.length, homeworks });
};

export const createHomework = async (req, res) => {
  const { title, subject, description } = req.body;
  if (!title || !subject) {
    return res.status(400).json({ success: false, message: "Title and subject are required" });
  }

  const newHomework = {
    id: String(homeworks.length + 1),
    title,
    subject,
    dateAssigned: new Date().toISOString().split("T")[0],
    description
  };
  homeworks.push(newHomework);
  res.status(201).json({ success: true, message: "Homework created successfully", homework: newHomework });
};

export const deleteHomework = async (req, res) => {
  const { id } = req.params;
  homeworks = homeworks.filter(h => h.id !== id);
  res.status(200).json({ success: true, message: "Homework deleted successfully" });
};
