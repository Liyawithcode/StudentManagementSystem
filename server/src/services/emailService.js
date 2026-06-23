import { sendEmail, sendVerificationOtp } from "../utils/sendEmail.js";

/**
 * Dispatch an email notification.
 */
export const dispatchEmail = async (to, subject, text, html) => {
  return await sendEmail({ to, subject, text, html });
};

/**
 * Dispatch the email verification OTP.
 */
export const dispatchVerificationOtp = async (email, otp) => {
  return await sendVerificationOtp(email, otp);
};
