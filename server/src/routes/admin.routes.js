import express from "express";
import { registerAdmin, getProfile as getAdminProfile, updateProfile as updateAdminProfile, getStats } from "../controller/admin.controller.js";
import { createUser, getUsers, getUserById, updateUser, deleteUser } from "../controller/user.controller.js";
import { getRoles, createRole, deleteRole } from "../controller/role.controller.js";
import { getPermissions, createPermission, deletePermission } from "../controller/permission.controller.js";
import { getLeaveRequests, updateLeaveStatus } from "../controller/leave.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

export const adminRouter = express.Router();

// Registration is public (or you can protect it if needed, but usually admin signup can be open for setup or limited)
adminRouter.post("/register", registerAdmin);

// All other routes require authentication and admin role
adminRouter.use(protect);
adminRouter.use(restrictTo("admin"));

adminRouter.route("/profile")
    .get(getAdminProfile)
    .put(updateAdminProfile);

adminRouter.get("/stats", getStats);

// User Management
adminRouter.route("/users")
    .get(getUsers)
    .post(createUser);

adminRouter.route("/users/:id")
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

// Role Management
adminRouter.route("/roles")
    .get(getRoles)
    .post(createRole);

adminRouter.delete("/roles/:id", deleteRole);

// Permission Management
adminRouter.route("/permissions")
    .get(getPermissions)
    .post(createPermission);

adminRouter.delete("/permissions/:id", deletePermission);

// Leave Requests Management
adminRouter.get("/leaves", getLeaveRequests);
adminRouter.put("/leaves/:id", updateLeaveStatus);
