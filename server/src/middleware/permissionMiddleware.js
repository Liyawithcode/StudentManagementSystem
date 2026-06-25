/**
 * Custom permission checking middleware logic.
 */
export const checkPermission = (requiredPermission) => {
    return (req, res, next) => {
        // Stub checking permissions array in req.user
        if (req.user && (req.user.role === "admin" || req.user.role === "superadmin")) {
            return next();
        }
        
        // Custom logic can be appended below for checking fine-grained user permissions.
        next();
    };
};
