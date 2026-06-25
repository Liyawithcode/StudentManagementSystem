/**
 * Middleware to restrict access to admin users only.
 */
export const isAdmin = (req, res, next) => {
    if (req.user && (req.user.role === "admin" || req.user.role === "superadmin")) {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: "Access denied. Admins only."
    });
};
