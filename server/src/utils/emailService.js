import { MailTransporter } from "../config/mail.config.js";
import { config_ENV } from "../config/auth.config.js";

export const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_USER || 'IntelliCampus'}" <${config_ENV.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        };

        const info = await MailTransporter.sendMail(mailOptions);
        console.log("Email sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email: " + error.message);
    }
};

/**
 * Helper to send email verification OTP
 * @param {string} email - Recipient email
 * @param {string} otp - OTP code to send
 * @returns {Promise<any>}
 */
export const sendVerificationOtp = async (email, otp, userName = "Unverified User") => {
    const subject = "Email Verification OTP";
    const text = `Your email verification OTP is ${otp}. It will expire in 10 minutes.`;
    const html = `
        <div style="max-width: 600px; margin: 0 auto; padding: 30px; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <h2 style="color: #4f46e5; font-size: 24px; font-weight: 700; margin-top: 0; margin-bottom: 24px;">Verify Your Email Address</h2>
            <p style="font-size: 16px; color: #1e293b; line-height: 1.5; margin-bottom: 12px;">Hello ${userName},</p>
            <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 24px;">
                Thank you for registering at Employee Hub. Use the following 6-digit verification code to complete your signup process:
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; background-color: #f1f5f9; padding: 16px 40px; border-radius: 12px; font-size: 32px; font-weight: 700; color: #4f46e5; letter-spacing: 4px; border: 1px solid #e2e8f0;">
                    ${otp}
                </div>
            </div>
            <p style="font-size: 14px; color: #64748b; line-height: 1.5; margin-bottom: 8px;">This verification code is valid for 10 minutes.</p>
            <p style="font-size: 14px; color: #64748b; line-height: 1.5; margin-bottom: 24px;">If you did not initiate this request, please ignore this email.</p>
            <div style="border-top: 1px solid #e2e8f0; margin-top: 30px; padding-top: 20px; text-align: center;">
                <span style="font-size: 13px; color: #94a3b8; font-weight: 500;">Employee Management System Dashboard</span>
            </div>
        </div>
    `;

    return sendEmail({ to: email, subject, text, html });
};

export default {
    sendEmail,
    sendVerificationOtp
};
