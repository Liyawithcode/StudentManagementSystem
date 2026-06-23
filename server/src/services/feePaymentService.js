import { Fee } from "../model/fee.model.js";

/**
 * Record a direct payment for a fee.
 */
export const recordPaymentAmount = async (feeId, amountPaid, paymentMethod) => {
  const fee = await Fee.findById(feeId);
  if (!fee) return null;

  if (paymentMethod) fee.paymentMethod = paymentMethod;
  
  if (amountPaid >= fee.feeAmount) {
    fee.feeStatus = "Paid";
  } else if (amountPaid > 0) {
    fee.feeStatus = "Partial";
  } else {
    fee.feeStatus = "pending";
  }

  return await fee.save();
};

/**
 * Direct payment status update.
 */
export const updatePaymentStatus = async (id, feeStatus, paymentMethod) => {
  const updateData = { feeStatus };
  if (paymentMethod) updateData.paymentMethod = paymentMethod;

  return await Fee.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};
