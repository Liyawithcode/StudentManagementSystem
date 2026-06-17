import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Facility name is required"],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
        },
        status: {
            type: String,
            enum: ["Available", "Under Maintenance", "Occupied"],
            default: "Available",
        },
        capacity: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export const Facility = mongoose.model("Facility", facilitySchema);
