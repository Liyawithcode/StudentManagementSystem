import { Fee } from "../model/fee.model.js";

export const recordPayment = async (req, res) => {
  try {
    const { feeId, amountPaid, paymentMethod } = req.body;
    if (!feeId || amountPaid === undefined) {
      return res.status(400).json({ success: false, message: "feeId and amountPaid are required" });
    }

    const fee = await Fee.findById(feeId);
    if (!fee) return res.status(404).json({ success: false, message: "Fee record not found" });

    // Update payment method
    if (paymentMethod) fee.paymentMethod = paymentMethod;
    
    // Check payment matching amounts
    if (amountPaid >= fee.feeAmount) {
      fee.feeStatus = "Paid";
    } else if (amountPaid > 0) {
      fee.feeStatus = "Partial";
    } else {
      fee.feeStatus = "pending";
    }

    await fee.save();

    res.status(200).json({ success: true, message: "Payment recorded successfully", fee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
