import { Transport } from "../model/transport.model.js";

export const getVehicles = async (req, res) => {
  try {
    const routes = await Transport.find().select("vehicleNumber driverName driverPhone routeNumber");
    const vehicles = routes.map(r => ({
      id: r._id,
      vehicleNumber: r.vehicleNumber,
      driverName: r.driverName,
      driverPhone: r.driverPhone,
      assignedRoute: r.routeNumber
    }));

    res.status(200).json({ success: true, count: vehicles.length, vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateVehicleDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { driverName, driverPhone, vehicleNumber } = req.body;

    const updateData = {};
    if (driverName) updateData.driverName = driverName;
    if (driverPhone) updateData.driverPhone = driverPhone;
    if (vehicleNumber) updateData.vehicleNumber = vehicleNumber;

    const route = await Transport.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!route) return res.status(404).json({ success: false, message: "Vehicle/Route not found" });

    res.status(200).json({ success: true, message: "Vehicle details updated successfully", vehicle: route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
