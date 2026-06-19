import express from "express";
import { createFacility, getAllFacilities, getFacilityById, updateFacility, deleteFacility } from "../controller/facility.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

export const facilityRouter = express.Router();

facilityRouter.use(protect);

facilityRouter.route("/")
    .get(getAllFacilities)
    .post(restrictTo("admin"), createFacility);

facilityRouter.route("/:id")
    .get(getFacilityById)
    .put(restrictTo("admin"), updateFacility)
    .delete(restrictTo("admin"), deleteFacility);
