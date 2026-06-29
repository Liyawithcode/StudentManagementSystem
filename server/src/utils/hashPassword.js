import bcrypt from "bcryptjs";
import { config_ENV } from "../config/auth.config.js";

export const hashPassword = async (password, saltRounds = config_ENV.BCRYPT_SALT_ROUNDS || 10) => {
    return await bcrypt.hash(password, saltRounds);
};

export default hashPassword;
