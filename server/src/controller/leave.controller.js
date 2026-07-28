import { Leave } from "../model/leave.model.js";
import { Group } from "../model/group.model.js";
import { Announcement } from "../model/announcement.model.js";
import { Faculty } from "../model/faculty.model.js";

export const applyLeave = async (req, res) => {
  try {
    const { applicantId, applicantType, startDate, endDate, reason } = req.body;
    if (!applicantId || !applicantType || !startDate || !endDate || !reason) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    const leave = await Leave.create({
      applicantId,
      applicantType,
      startDate,
      endDate,
      reason,
      status: "pending",
    });

    let notificationSent = false;

    // Trigger dashboard notifications to students if the applicant is Faculty
    if (applicantType === "Faculty") {
      try {
        // Find faculty details
        let facultyName = "Faculty Member";
        const facultyObj = await Faculty.findOne({
          $or: [
            { facultyId: applicantId },
            { email: applicantId },
            { _id: applicantId.match(/^[0-9a-fA-F]{24}$/) ? applicantId : null },
          ],
        });

        if (facultyObj) {
          facultyName = `${facultyObj.firstName} ${facultyObj.lastName}`.trim();
        } else if (req.user) {
          facultyName = `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim() || req.user.email || "Faculty Member";
        }

        // Find all groups assigned to this faculty
        const groups = await Group.find({
          $or: [
            { facultyId: applicantId },
            { facultyId: facultyObj ? facultyObj.facultyId : null },
            { facultyId: facultyObj ? facultyObj._id.toString() : null },
          ].filter(Boolean),
        });

        // Gather all student IDs in these groups
        const studentSet = new Set();
        let groupNamesList = [];

        groups.forEach((grp) => {
          groupNamesList.push(grp.name);
          if (Array.isArray(grp.studentIds)) {
            grp.studentIds.forEach((sid) => studentSet.add(sid));
          }
        });

        const targetStudents = Array.from(studentSet);
        const sDateStr = new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        const eDateStr = new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

        // Create Announcement / Dashboard Notification for students
        await Announcement.create({
          title: `Faculty Leave Notice: ${facultyName}`,
          content: `Faculty ${facultyName} (${groups.length > 0 ? groupNamesList.join(", ") : "Your Department Faculty"}) has submitted leave from ${sDateStr} to ${eDateStr}. Reason: ${reason}.`,
          audience: "Students",
          author: facultyName,
          isLeaveNotice: true,
          facultyId: applicantId,
          groupName: groupNamesList.join(", "),
          targetStudentIds: targetStudents,
        });

        notificationSent = true;
      } catch (notifErr) {
        console.error("Error creating student leave notification:", notifErr);
      }
    }

    res.status(201).json({
      success: true,
      message: notificationSent
        ? "Leave application submitted successfully. Dashboard notification sent to all group students!"
        : "Leave application submitted successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLeaveRequests = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: leaves.length, leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFacultyLeaveRequests = async (req, res) => {
  try {
    const leaves = await Leave.find({ applicantType: "Faculty" }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: leaves.length, leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyLeaveRequests = async (req, res) => {
  try {
    const { applicantId } = req.params;
    const leaves = await Leave.find({ applicantId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: leaves.length, leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Approved / Rejected

    if (!status || !["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Please provide a valid status ('Approved' or 'Rejected')" });
    }

    const leave = await Leave.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ success: false, message: "Leave request not found" });
    }

    res.status(200).json({ success: true, message: "Leave request status updated", leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
