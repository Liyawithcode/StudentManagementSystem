import jwt from "jsonwebtoken";
import { config_ENV } from "../config/auth.config.js";
import { Student } from "../model/student.model.js";
import { Faculty } from "../model/faculty.model.js";
import { Admin } from "../model/admin.model.js";
import { User } from "../model/user.model.js";

/**
 * Middleware to protect routes via JWT verification
 */
export const protect = async (req, res, next) => {
    try {
        let token;
        
        // Check Authorization Header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        } 
        // Check Cookies
        else if (req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to access this route. No token provided.",
            });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, config_ENV.ACCESS_TOKEN_SECRET);

        // Fetch corresponding user record based on the role in payload
        let user;
        if (decoded.role === "student") {
            user = await Student.findById(decoded.id);
        } else if (decoded.role === "faculty") {
            user = await Faculty.findById(decoded.id);
        } else if (decoded.role === "admin") {
            user = await Admin.findById(decoded.id);
        } else {
            user = await User.findById(decoded.id);
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User belonging to this token no longer exists.",
            });
        }

        // Attach user object to request
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized to access this route. Invalid or expired token.",
            error: error.message
        });
    }
};
