import jwt from "jsonwebtoken";
import { config_ENV } from "../config/auth.config.js";

/**
 * Verify a JWT token
 * @param {string} token - The JWT token to verify
 * @param {string} [secret] - The secret key to verify the token with (defaults to ACCESS_TOKEN_SECRET)
 * @returns {object} - The decoded token payload
 */
export const verifyToken = (token, secret = config_ENV.ACCESS_TOKEN_SECRET) => {
    return jwt.verify(token, secret);
};

export default verifyToken;
