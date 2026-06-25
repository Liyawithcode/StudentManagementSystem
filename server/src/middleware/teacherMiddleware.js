/**
 * Middleware to restrict access to teacher/faculty users only.
 */
export const isTeacher = (req, res, next) => {
    if (req.user && req.user.role === "faculty") {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: "Access denied. Faculty/Teachers only."
    });
};
