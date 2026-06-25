const ipRequests = new Map();

/**
 * Simple in-memory IP rate limiter middleware.
 */
export const rateLimiter = (limit = 100, windowMs = 15 * 60 * 1000) => {
    return (req, res, next) => {
        const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const now = Date.now();

        if (!ipRequests.has(ip)) {
            ipRequests.set(ip, []);
        }

        const timestamps = ipRequests.get(ip).filter(time => now - time < windowMs);
        timestamps.push(now);
        ipRequests.set(ip, timestamps);

        if (timestamps.length > limit) {
            return res.status(429).json({
                success: false,
                message: "Too many requests, please try again later."
            });
        }
        next();
    };
};
