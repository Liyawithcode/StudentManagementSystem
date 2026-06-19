import express from "express";
import { assignStudentToRoute, getStudentRouteDetails } from "../controller/transport.controller.js";
import { createRoute, getRoutes, deleteRoute } from "../controller/route.controller.js";
import { getVehicles, updateVehicleDetails } from "../controller/vehicle.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

export const transportRouter = express.Router();

transportRouter.use(protect);

// Routes
transportRouter.route("/routes")
    .get(getRoutes)
    .post(restrictTo("admin"), createRoute);

transportRouter.delete("/routes/:id", restrictTo("admin"), deleteRoute);

// Assignment
transportRouter.post("/assign", restrictTo("admin"), assignStudentToRoute);
transportRouter.get("/student/:studentId", getStudentRouteDetails);

// Vehicles
transportRouter.get("/vehicles", getVehicles);
transportRouter.put("/vehicles", restrictTo("admin"), updateVehicleDetails);
