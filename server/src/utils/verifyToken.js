import jwt from "jsonwebtoken";
import { config_ENV } from "../config/auth.config.js";

export const verifyToken = (token, secret = config_ENV.ACCESS_TOKEN_SECRET) => {
    return jwt.verify(token, secret);
};

export default verifyToken;
