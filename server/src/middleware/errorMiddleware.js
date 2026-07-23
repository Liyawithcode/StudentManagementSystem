import { config_ENV } from "../config/auth.config.js";

/**
 * Global Express error handling middleware.
 */
export const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || err.status || 500;
    let message = err.message || "Internal Server Error";

    if (err instanceof SyntaxError && (err.status === 400 || statusCode === 400) && 'body' in err) {
        message = "Invalid JSON payload in request body";
    }

    return res.status(statusCode).json({
        success: false,
        message,
        stack: config_ENV.NODE_ENV === "development" ? err.stack : undefined,
    });
};
