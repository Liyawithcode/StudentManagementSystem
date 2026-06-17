let complaints = [
  { id: "1", title: "Broken Desk in Room 102", description: "The front desk has a broken leg.", filedBy: "STU5032", status: "pending" }
];

export const getComplaints = async (req, res) => {
  res.status(200).json({ success: true, count: complaints.length, complaints });
};

export const fileComplaint = async (req, res) => {
  const { title, description, filedBy } = req.body;
  if (!title || !description || !filedBy) {
    return res.status(400).json({ success: false, message: "Required fields: title, description, filedBy" });
  }

  const newComplaint = { id: String(complaints.length + 1), title, description, filedBy, status: "pending" };
  complaints.push(newComplaint);
  res.status(201).json({ success: true, message: "Complaint filed successfully", complaint: newComplaint });
};

export const resolveComplaint = async (req, res) => {
  const { id } = req.params;
  const complaint = complaints.find(c => c.id === id);
  if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });

  complaint.status = "Resolved";
  res.status(200).json({ success: true, message: "Complaint status updated to Resolved", complaint });
};
