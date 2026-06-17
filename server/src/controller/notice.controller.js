let notices = [
  { id: "1", title: "Holiday Notice", content: "School will remain closed on June 18th for local festival.", date: "2026-06-10" }
];

export const getNotices = async (req, res) => {
  res.status(200).json({ success: true, count: notices.length, notices });
};

export const createNotice = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ success: false, message: "Title and content are required" });

  const newNotice = {
    id: String(notices.length + 1),
    title,
    content,
    date: new Date().toISOString().split("T")[0]
  };
  notices.push(newNotice);
  res.status(201).json({ success: true, message: "Notice posted successfully", notice: newNotice });
};

export const deleteNotice = async (req, res) => {
  const { id } = req.params;
  notices = notices.filter(n => n.id !== id);
  res.status(200).json({ success: true, message: "Notice deleted successfully" });
};
