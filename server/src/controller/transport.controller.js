import { Transport } from "../model/transport.model.js";

export const assignStudentToRoute = async (req, res) => {
  try {
    const { routeNumber, studentId } = req.body;
    if (!routeNumber || !studentId) {
      return res.status(400).json({ success: false, message: "routeNumber and studentId are required" });
    }

    const route = await Transport.findOne({ routeNumber });
    if (!route) return res.status(404).json({ success: false, message: "Transport route not found" });

    if (!route.studentIds.includes(studentId)) {
      route.studentIds.push(studentId);
      await route.save();
    }

    res.status(200).json({ success: true, message: "Student assigned to transport route successfully", route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentRouteDetails = async (req, res) => {
  try {
    const { studentId } = req.params;
    const route = await Transport.findOne({ studentIds: studentId });
    if (!route) {
      return res.status(404).json({ success: false, message: "No transport route assigned to this student" });
    }

    res.status(200).json({ success: true, route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
