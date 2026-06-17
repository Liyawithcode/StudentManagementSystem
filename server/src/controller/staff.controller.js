let staffMembers = [
  { id: "1", employeeId: "STF1001", name: "Alice Green", role: "Librarian", status: "Active" },
  { id: "2", employeeId: "STF1002", name: "Bob Miller", role: "Registrar Accountant", status: "Active" }
];

export const getStaffList = async (req, res) => {
  res.status(200).json({ success: true, count: staffMembers.length, staffMembers });
};

export const createStaff = async (req, res) => {
  const { employeeId, name, role } = req.body;
  if (!employeeId || !name || !role) {
    return res.status(400).json({ success: false, message: "Required: employeeId, name, role" });
  }

  const newStaff = { id: String(staffMembers.length + 1), employeeId, name, role, status: "Active" };
  staffMembers.push(newStaff);
  res.status(201).json({ success: true, message: "Staff member registered successfully", staff: newStaff });
};

export const deleteStaff = async (req, res) => {
  const { id } = req.params;
  staffMembers = staffMembers.filter(s => s.id !== id);
  res.status(200).json({ success: true, message: "Staff member deleted successfully" });
};
