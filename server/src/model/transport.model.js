import mongoose from "mongoose";

const transportSchema = new mongoose.Schema(
  {
    routeNumber: {
      type: String,
      required: [true, "Route number is required"],
      unique: true,
      trim: true,
    },
    driverName: {
      type: String,
      required: [true, "Driver name is required"],
      trim: true,
    },
    driverPhone: {
      type: String,
      trim: true,
    },
    vehicleNumber: {
      type: String,
      required: [true, "Vehicle plate number is required"],
      trim: true,
    },
    stops: [
      {
        type: String,
        trim: true,
      },
    ],
    studentIds: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

export const Transport = mongoose.model("Transport", transportSchema);
