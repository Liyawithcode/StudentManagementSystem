/**
 * Dispatch a simulated SMS notification.
 */
export const dispatchSMS = async (phoneNumber, message) => {
  console.log(`[SMS Dispatch] Sending message to ${phoneNumber}: "${message}"`);
  return {
    success: true,
    messageId: `sms_${Math.random().toString(36).substr(2, 9)}`,
    status: "delivered"
  };
};
