/**
 * Middleware to restrict access to student users only.
 */
export const isStudent = (req, res, next) => {
    if (req.user && req.user.role === "student") {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: "Access denied. Students only."
    });
};
