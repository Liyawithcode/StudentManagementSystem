export let notices = [
  { id: "1", title: "Summer Vacations Announcement", content: "This is to inform all students and faculty members that the campus will remain closed for summer vacations.", date: "2026-06-25", category: "General", postedBy: "Dean of Academics" },
  { id: "2", title: "Final Semester Examinations Schedule", content: "The final semester exam schedule for all undergraduate courses has been published.", date: "2026-06-22", category: "Academic", postedBy: "Controller of Exams" },
  { id: "3", title: "Annual Sports Day Registrations Open", content: "Registrations for the Annual Sports Meet 2026 are now officially open.", date: "2026-06-18", category: "Events", postedBy: "Sports Committee" }
];

export const getNotices = async (req, res) => {
  res.status(200).json({ success: true, count: notices.length, notices });
};

export const createNotice = async (req, res) => {
  const { title, content, message } = req.body;
  const noticeContent = content || message;

  if (!title || !noticeContent) {
    return res.status(400).json({ success: false, message: "Title and content are required" });
  }

  const newNotice = {
    id: String(notices.length + 1),
    title,
    content: noticeContent,
    message: noticeContent,
    date: new Date().toISOString().split("T")[0]
  };
  notices.push(newNotice);
  res.status(201).json({ success: true, message: "Notice posted successfully", notice: newNotice });
};

export const deleteNotice = async (req, res) => {
  const { id } = req.params;
  notices = notices.filter(n => n.id !== id && n._id !== id);
  res.status(200).json({ success: true, message: "Notice deleted successfully" });
};

