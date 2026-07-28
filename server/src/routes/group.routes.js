import express from "express";
import {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
} from "../controller/group.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

export const groupRouter = express.Router();

// Protected routes
groupRouter.use(protect);

groupRouter.route("/")
  .get(getAllGroups)
  .post(restrictTo("admin", "faculty"), createGroup);

groupRouter.route("/:id")
  .get(getGroupById)
  .put(restrictTo("admin", "faculty"), updateGroup)
  .delete(restrictTo("admin"), deleteGroup);
