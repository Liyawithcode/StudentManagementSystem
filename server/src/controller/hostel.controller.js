import { RoomAllocation } from "../model/hostel.model.js";

export const getHostelSummary = async (req, res) => {
  try {
    const totalRooms = await RoomAllocation.countDocuments();
    const allocatedRooms = await RoomAllocation.countDocuments({ status: "Allocated" });
    const availableRooms = await RoomAllocation.countDocuments({ status: "Available" });

    // Group by block to show totals
    const blocksSummary = await RoomAllocation.aggregate([
      {
        $group: {
          _id: "$block",
          total: { $sum: 1 },
          allocated: { $sum: { $cond: [{ $eq: ["$status", "Allocated"] }, 1, 0] } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      summary: {
        totalRooms,
        allocatedRooms,
        availableRooms,
        blocks: blocksSummary
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRooms = async (req, res) => {
  try {
    const rooms = await RoomAllocation.find();
    res.status(200).json({ success: true, count: rooms.length, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
