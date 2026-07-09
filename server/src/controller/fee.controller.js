import { Fee } from "../model/fee.model.js";

// Create Fee Record
export const createFee = async (req, res) => {
  try {
    const { studentId, courseId, feeAmount, feeType, dueDate, paymentMethod, feeStatus } = req.body;

    if (!studentId || !courseId || feeAmount === undefined || !feeType || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields: studentId, courseId, feeAmount, feeType, dueDate",
      });
    }

    const validFeeTypes = ["Admission", "Examination", "Hostel", "Library", "Other"];
    if (!validFeeTypes.includes(feeType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid feeType. Must be one of: ${validFeeTypes.join(", ")}`,
      });
    }

    const fee = await Fee.create({
      studentId,
      courseId,
      feeAmount,
      feeType,
      feeStatus: feeStatus || "pending",
      dueDate,
      paymentMethod: paymentMethod || "CASH",
    });

    res.status(201).json({
      success: true,
      message: "Fee record created successfully",
      fee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Fee Records
export const getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find();

    res.status(200).json({
      success: true,
      count: fees.length,
      fees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Fee Records by Student ID
export const getFeesByStudent = async (req, res) => {
  try {
    let studentId = req.params.studentId || req.query.studentId;

    // Allow 'me' as a shortcut for the logged-in user's own ID
    if (studentId === 'me' && req.user) {
      studentId = req.user._id.toString();
    }

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Please provide student ID",
      });
    }

    // Search by the studentId field value — could be MongoDB ObjectId or custom ID
    const fees = await Fee.find({
      studentId: studentId,
    }).sort({ dueDate: -1 });

    res.status(200).json({
      success: true,
      count: fees.length,
      fees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Payment Status
export const updatePayment = async (req, res) => {
  try {
    const id = req.params.id || req.body.feeId;
    const { feeStatus, paymentMethod } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Fee ID is required",
      });
    }

    if (!feeStatus || !["Paid", "pending", "Partial"].includes(feeStatus)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid feeStatus ('Paid', 'pending', 'Partial')",
      });
    }

    const updateData = { feeStatus };
    if (paymentMethod) updateData.paymentMethod = paymentMethod;

    const fee = await Fee.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      fee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Fee Record
export const deleteFee = async (req, res) => {
  try {
    const { id } = req.params;

    const fee = await Fee.findByIdAndDelete(id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fee record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};