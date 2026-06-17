// In-memory or simple database stub roles list
let roles = [
  { id: "1", name: "admin", description: "System Administrator" },
  { id: "2", name: "faculty", description: "Teacher / Faculty member" },
  { id: "3", name: "student", description: "Student enrolled in courses" },
  { id: "4", name: "parent", description: "Student parent / guardian" }
];

export const getRoles = async (req, res) => {
  res.status(200).json({ success: true, count: roles.length, roles });
};

export const createRole = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ success: false, message: "Role name is required" });
  
  const newRole = { id: String(roles.length + 1), name, description };
  roles.push(newRole);
  res.status(201).json({ success: true, message: "Role created successfully", role: newRole });
};

export const deleteRole = async (req, res) => {
  const { id } = req.params;
  roles = roles.filter(r => r.id !== id);
  res.status(200).json({ success: true, message: "Role deleted successfully" });
};
