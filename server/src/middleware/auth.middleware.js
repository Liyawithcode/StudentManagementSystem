import { config_ENV } from "../config/auth.config.js";
export const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        stack: config_ENV.NODE_ENV === "development" ? err.stack : undefined,
    });
}