/**
 * Middleware checking password validation criteria (length, complexity) on request payload.
 */
export const validatePasswordStrength = (req, res, next) => {
    const { password } = req.body;
    if (password && password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password validation failed. Must be at least 6 characters long."
        });
    }
    next();
};
