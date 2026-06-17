import mongoose from "mongoose";

const roomAllocationSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, "Room number is required"],
      trim: true,
    },
    block: {
      type: String,
      required: [true, "Block name is required"],
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Single", "Double", "Shared"],
      default: "Shared",
    },
    studentId: {
      type: String, // student ID assigned to the room (can be null if vacant)
      default: null,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Available", "Allocated"],
      default: "Available",
    },
  },
  { timestamps: true }
);

export const RoomAllocation = mongoose.model("RoomAllocation", roomAllocationSchema);
