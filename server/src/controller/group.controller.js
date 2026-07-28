import { Group } from "../model/group.model.js";
import { Faculty } from "../model/faculty.model.js";
import { Student } from "../model/student.model.js";

// Create new Student Group
export const createGroup = async (req, res) => {
  try {
    const { name, code, department, facultyId, facultyName, studentIds, description } = req.body;

    if (!name || !code || !facultyId) {
      return res.status(400).json({
        success: false,
        message: "Group name, group code, and assigned faculty are required",
      });
    }

    const existingCode = await Group.findOne({ code: code.toUpperCase() });
    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: `Group code '${code}' already exists. Please use a unique code.`,
      });
    }

    // Try finding faculty name if missing
    let resolvedFacultyName = facultyName || "";
    if (!resolvedFacultyName) {
      const fac = await Faculty.findOne({
        $or: [{ facultyId: facultyId }, { _id: facultyId.match(/^[0-9a-fA-F]{24}$/) ? facultyId : null }],
      });
      if (fac) {
        resolvedFacultyName = `${fac.firstName} ${fac.lastName}`.trim();
      }
    }

    const group = await Group.create({
      name,
      code: code.toUpperCase(),
      department: department || "General",
      facultyId,
      facultyName: resolvedFacultyName,
      studentIds: Array.isArray(studentIds) ? studentIds : [],
      description: description || "",
    });

    res.status(201).json({
      success: true,
      message: "Student Group created successfully",
      group,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all groups with optional filter for faculty or student
export const getAllGroups = async (req, res) => {
  try {
    const { facultyId, studentId, search, department } = req.query;

    let filter = {};

    if (facultyId) {
      filter.facultyId = facultyId;
    }

    if (studentId) {
      filter.studentIds = { $in: [studentId] };
    }

    if (department) {
      filter.department = department;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
        { facultyName: { $regex: search, $options: "i" } },
      ];
    }

    const groups = await Group.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: groups.length,
      groups,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single group details
export const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    // Populate student details if possible
    const students = await Student.find({
      $or: [
        { studentId: { $in: group.studentIds } },
        { _id: { $in: group.studentIds.filter((sid) => sid.match(/^[0-9a-fA-F]{24}$/)) } },
      ],
    });

    res.status(200).json({
      success: true,
      group,
      enrolledStudents: students,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Group details / student membership
export const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, department, facultyId, facultyName, studentIds, description, status } = req.body;

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    if (name) group.name = name;
    if (code) group.code = code.toUpperCase();
    if (department) group.department = department;
    if (facultyId) group.facultyId = facultyId;
    if (facultyName) group.facultyName = facultyName;
    if (Array.isArray(studentIds)) group.studentIds = studentIds;
    if (description !== undefined) group.description = description;
    if (status) group.status = status;

    await group.save();

    res.status(200).json({
      success: true,
      message: "Group updated successfully",
      group,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Group
export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findByIdAndDelete(id);

    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    res.status(200).json({
      success: true,
      message: "Group deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
