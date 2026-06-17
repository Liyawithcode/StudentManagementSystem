import { Fee } from "../model/fee.model.js";

export const getInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const fee = await Fee.findById(id);
    if (!fee) return res.status(404).json({ success: false, message: "Fee record not found" });

    // Generate formatted invoice stub details
    const invoice = {
      invoiceNumber: `INV-${fee._id.toString().substring(18).toUpperCase()}`,
      studentId: fee.studentId,
      courseId: fee.courseId,
      dueDate: fee.dueDate,
      feeType: fee.feeType,
      amount: fee.feeAmount,
      status: fee.feeStatus,
      paymentMethod: fee.paymentMethod,
      billingDate: fee.createdAt
    };

    res.status(200).json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
