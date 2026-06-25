/**
 * Middleware tracking and logging audit trails of user operations.
 */
export const auditLog = (actionName) => {
    return (req, res, next) => {
        const user = req.user ? req.user.email : "anonymous";
        console.log(`[AUDIT LOG] Action: ${actionName} | Executed By: ${user} | Time: ${new Date().toISOString()}`);
        next();
    };
};
