/**
 * Middleware to respond with 404 for unhandled route accesses.
 */
export const notFoundMiddleware = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found - ${req.originalUrl}`
    });
};
