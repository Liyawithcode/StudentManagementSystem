import { RoomAllocation } from "../model/hostel.model.js";

export const createRoom = async (req, res) => {
  try {
    const { roomNumber, block, type } = req.body;
    if (!roomNumber || !block) {
      return res.status(400).json({ success: false, message: "Required fields: roomNumber, block" });
    }

    const room = await RoomAllocation.create({
      roomNumber,
      block,
      type: type || "Shared",
      status: "Available"
    });

    res.status(201).json({ success: true, message: "Hostel room added successfully", room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const allocateRoom = async (req, res) => {
  try {
    const { id } = req.params; // Room id
    const { studentId } = req.body;
    if (!studentId) return res.status(400).json({ success: false, message: "Student ID is required" });

    const room = await RoomAllocation.findById(id);
    if (!room) return res.status(404).json({ success: false, message: "Room not found" });

    if (room.status === "Allocated") {
      return res.status(400).json({ success: false, message: "Room is already allocated" });
    }

    room.studentId = studentId;
    room.status = "Allocated";
    await room.save();

    res.status(200).json({ success: true, message: "Room allocated successfully", room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const vacateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await RoomAllocation.findById(id);
    if (!room) return res.status(404).json({ success: false, message: "Room not found" });

    room.studentId = null;
    room.status = "Available";
    await room.save();

    res.status(200).json({ success: true, message: "Room vacated successfully", room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
