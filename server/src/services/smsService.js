import { sendSMS } from "../utils/index.js";

/**
 * Dispatch a simulated SMS notification.
 */
export const dispatchSMS = async (phoneNumber, message) => {
  return await sendSMS(phoneNumber, message);
};
