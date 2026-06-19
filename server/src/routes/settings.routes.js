import express from "express";
import { getSettings, updateSettings } from "../controller/settings.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

export const settingsRouter = express.Router();

settingsRouter.use(protect);

settingsRouter.route("/")
    .get(getSettings)
    .put(restrictTo("admin"), updateSettings);
