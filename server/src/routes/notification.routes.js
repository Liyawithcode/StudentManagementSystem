import express from "express";
import { sendNotification, getNotifications } from "../controller/notification.controller.js";
import { protect } from "../middleware/auth.middleware.js";

export const notificationRouter = express.Router();

notificationRouter.use(protect);

notificationRouter.route("/")
  .get(getNotifications)
  .post(sendNotification);
