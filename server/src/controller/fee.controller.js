import Fee from "../models/Fee.js";

export const createFee = async (req, res) => {
  try {
    const { student, feeType, amount, paidAmount, paymentMethod } = req.body;

    const remainingAmount = amount - (paidAmount || 0);

    let status = "PENDING";
    if (paidAmount >= amount) status = "PAID";
    else if (paidAmount > 0) status = "PARTIAL";

    const fee = await Fee.create({
      student,
      feeType,
      amount,
      paidAmount: paidAmount || 0,
      remainingAmount,
      status,
      paymentMethod,
      paymentDate: paidAmount > 0 ? new Date() : null,
    });

    res.status(201).json({
      success: true,
      message: "Fee created successfully",
      fee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllFees = async (req, res) => {
  try {
    const student = req.body;
    const fees = await Fee.find({ student });

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


export const getFeesByStudent = async (req, res) => {
  try {
    const student = req.body;
    const fees = await Fee.find({ student });

    res.status(200).json({
      success: true,
      fees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const { paidAmount } = req.body;

    const student = req.body;
    const fee = await Fee.findOne({ student });

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee not found",
      });
    }

    fee.paidAmount += paidAmount;
    fee.remainingAmount = fee.amount - fee.paidAmount;

    if (fee.paidAmount >= fee.amount) {
      fee.status = "PAID";
    } else if (fee.paidAmount > 0) {
      fee.status = "PARTIAL";
    }

    fee.paymentDate = new Date();

    await fee.save();

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


export const deleteFee = async (req, res) => {
  try {
    const student = req.body;
    const fee = await Fee.findOneAndDelete({ student });

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fee deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};