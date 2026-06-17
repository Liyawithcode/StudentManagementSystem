let permissions = [
  { id: "1", resource: "students", action: "write", description: "Register or delete student profiles" },
  { id: "2", resource: "courses", action: "write", description: "Create or delete course entries" },
  { id: "3", resource: "attendance", action: "write", description: "Record daily attendance logs" }
];

export const getPermissions = async (req, res) => {
  res.status(200).json({ success: true, count: permissions.length, permissions });
};

export const createPermission = async (req, res) => {
  const { resource, action, description } = req.body;
  if (!resource || !action) {
    return res.status(400).json({ success: false, message: "Resource and action are required" });
  }

  const newPerm = { id: String(permissions.length + 1), resource, action, description };
  permissions.push(newPerm);
  res.status(201).json({ success: true, message: "Permission created successfully", permission: newPerm });
};

export const deletePermission = async (req, res) => {
  const { id } = req.params;
  permissions = permissions.filter(p => p.id !== id);
  res.status(200).json({ success: true, message: "Permission deleted successfully" });
};
