export const calculateFeeDetails = (baseAmount, paidAmount, discountPercent = 0, lateFee = 0) => {
  const discountAmount = parseFloat(((baseAmount * discountPercent) / 100).toFixed(2));
  const netTotal = parseFloat((baseAmount - discountAmount + lateFee).toFixed(2));
  const outstandingAmount = parseFloat((netTotal - paidAmount).toFixed(2));
  const status = outstandingAmount <= 0 ? "Paid" : paidAmount > 0 ? "Partial" : "Unpaid";

  return {
    baseAmount,
    discountAmount,
    lateFee,
    netTotal,
    paidAmount,
    outstandingAmount,
    status
  };
};

export default calculateFeeDetails;
