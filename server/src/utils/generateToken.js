import jwt from "jsonwebtoken";
import { config_ENV } from "../config/auth.config.js";

export const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
        },
        config_ENV.ACCESS_TOKEN_SECRET,
        {
            expiresIn: config_ENV.ACCESS_TOKEN_EXPIRE_TIME || "15m",
        }
    );
};

export default generateToken;
