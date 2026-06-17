import { Transport } from "../model/transport.model.js";

export const createRoute = async (req, res) => {
  try {
    const { routeNumber, driverName, driverPhone, vehicleNumber, stops } = req.body;
    if (!routeNumber || !driverName || !vehicleNumber) {
      return res.status(400).json({ success: false, message: "routeNumber, driverName and vehicleNumber are required" });
    }

    const route = await Transport.create({
      routeNumber,
      driverName,
      driverPhone,
      vehicleNumber,
      stops: stops || []
    });

    res.status(201).json({ success: true, message: "Transport route created successfully", route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRoutes = async (req, res) => {
  try {
    const routes = await Transport.find();
    res.status(200).json({ success: true, count: routes.length, routes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteRoute = async (req, res) => {
  try {
    const route = await Transport.findByIdAndDelete(req.params.id);
    if (!route) return res.status(404).json({ success: false, message: "Route not found" });
    res.status(200).json({ success: true, message: "Transport route deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
