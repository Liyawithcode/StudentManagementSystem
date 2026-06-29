import { MailTransporter } from "../config/mail.config.js";
import { config_ENV } from "../config/auth.config.js";

export const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_USER || 'Student Management System'}" <${config_ENV.EMAIL_USER}>`,
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
        throw new Error("Failed to send verification email: " + error.message);
    }
};

/**
 * Helper to send email verification OTP
 */
export const sendVerificationOtp = async (email, otp) => {
    const subject = "Email Verification OTP";
    const text = `Your email verification OTP is ${otp}. It will expire in 15 minutes.`;
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
            <h2 style="color: #4A90E2; margin-top: 0;">Email Verification</h2>
            <p>Welcome to the Student Management System!</p>
            <p>Your one-time password (OTP) for registration verification is:</p>
            <div style="font-size: 24px; font-weight: bold; padding: 10px; background-color: #f7f7f7; display: inline-block; letter-spacing: 2px; border-radius: 4px; border: 1px solid #ddd;">
                ${otp}
            </div>
            <p style="color: #888; font-size: 12px; margin-top: 20px;">This OTP will expire in 15 minutes. If you did not request this verification, please ignore this email.</p>
        </div>
    `;

    return sendEmail({ to: email, subject, text, html });
};
