import bcrypt from "bcryptjs";
import { config_ENV } from "../config/auth.config.js";

/**
 * Hash a plain text password
 * @param {string} password - The plain text password to hash
 * @param {number} [saltRounds] - The number of salt rounds (defaults to config_ENV.BCRYPT_SALT_ROUNDS or 10)
 * @returns {Promise<string>} - The hashed password
 */
export const hashPassword = async (password, saltRounds = config_ENV.BCRYPT_SALT_ROUNDS || 10) => {
    return await bcrypt.hash(password, saltRounds);
};

export default hashPassword;
