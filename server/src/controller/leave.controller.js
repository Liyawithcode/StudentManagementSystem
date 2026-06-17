import { Leave } from "../model/leave.model.js";

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

    res.status(201).json({ success: true, message: "Leave application submitted successfully", leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLeaveRequests = async (req, res) => {
  try {
    const leaves = await Leave.find();
    res.status(200).json({ success: true, count: leaves.length, leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyLeaveRequests = async (req, res) => {
  try {
    const { applicantId } = req.params;
    const leaves = await Leave.find({ applicantId });
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
