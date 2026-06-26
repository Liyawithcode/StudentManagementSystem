import jwt from "jsonwebtoken";
import { config_ENV } from "../config/auth.config.js";

/**
 * Generate a JWT refresh token for a user
 * @param {Object} user - User object with _id, email, and role
 * @returns {String} JWT token
 */
export const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role
        },
        config_ENV.REFRESH_TOKEN_SECRET,
        {
            expiresIn: config_ENV.REFRESH_TOKEN_EXPIRE_TIME || "7d"
        }
    );
};

export default generateRefreshToken;
