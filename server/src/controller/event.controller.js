let events = [
  { id: "1", title: "Sports Day 2026", date: "2026-06-15", location: "School Ground", description: "Annual athletic meet" }
];

export const getEvents = async (req, res) => {
  res.status(200).json({ success: true, count: events.length, events });
};

export const createEvent = async (req, res) => {
  const { title, date, location, description } = req.body;
  if (!title || !date) return res.status(400).json({ success: false, message: "Title and date are required" });

  const newEvent = { id: String(events.length + 1), title, date, location, description };
  events.push(newEvent);
  res.status(201).json({ success: true, message: "Event scheduled successfully", event: newEvent });
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  events = events.filter(e => e.id !== id);
  res.status(200).json({ success: true, message: "Event deleted successfully" });
};
