import express from "express";
import { getComplaints, fileComplaint, resolveComplaint } from "../controller/complaint.controller.js";
import { getEvents, createEvent, deleteEvent } from "../controller/event.controller.js";
import { getNotices, createNotice, deleteNotice } from "../controller/notice.controller.js";
import { sendNotification, getNotifications } from "../controller/notification.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

export const communicationRouter = express.Router();

communicationRouter.use(protect);

// Complaints routes
communicationRouter.route("/complaints")
    .get(getComplaints)
    .post(fileComplaint);

communicationRouter.put("/complaints/:id/resolve", restrictTo("admin"), resolveComplaint);

// Events routes
communicationRouter.route("/events")
    .get(getEvents)
    .post(restrictTo("admin", "faculty"), createEvent);

communicationRouter.delete("/events/:id", restrictTo("admin"), deleteEvent);

// Notices routes
communicationRouter.route("/notices")
    .get(getNotices)
    .post(restrictTo("admin"), createNotice);

communicationRouter.delete("/notices/:id", restrictTo("admin"), deleteNotice);

// Notifications routes
communicationRouter.route("/notifications")
    .get(getNotifications)
    .post(sendNotification);
