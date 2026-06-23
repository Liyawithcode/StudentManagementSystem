let notices = [
  { id: "1", title: "Holiday Notice", content: "School will remain closed on June 18th for local festival.", date: "2026-06-10" }
];

let events = [
  { id: "1", title: "Sports Day 2026", date: "2026-06-15", location: "School Ground", description: "Annual athletic meet" }
];

let complaints = [
  { id: "1", title: "Broken Desk in Room 102", description: "The front desk has a broken leg.", filedBy: "STU5032", status: "pending" }
];

/* Notice Operations */
export const getNoticesList = async () => {
  return notices;
};

export const addNotice = async (title, content) => {
  const newNotice = {
    id: String(notices.length + 1),
    title,
    content,
    date: new Date().toISOString().split("T")[0]
  };
  notices.push(newNotice);
  return newNotice;
};

export const removeNotice = async (id) => {
  const originalLength = notices.length;
  notices = notices.filter(n => n.id !== id);
  return notices.length < originalLength;
};

/* Event Operations */
export const getEventsList = async () => {
  return events;
};

export const addEvent = async (title, date, location, description) => {
  const newEvent = { id: String(events.length + 1), title, date, location, description };
  events.push(newEvent);
  return newEvent;
};

export const removeEvent = async (id) => {
  const originalLength = events.length;
  events = events.filter(e => e.id !== id);
  return events.length < originalLength;
};

/* Complaint Operations */
export const getComplaintsList = async () => {
  return complaints;
};

export const addComplaint = async (title, description, filedBy) => {
  const newComplaint = { id: String(complaints.length + 1), title, description, filedBy, status: "pending" };
  complaints.push(newComplaint);
  return newComplaint;
};

export const resolveComplaintStatus = async (id) => {
  const complaint = complaints.find(c => c.id === id);
  if (!complaint) return null;
  complaint.status = "Resolved";
  return complaint;
};
