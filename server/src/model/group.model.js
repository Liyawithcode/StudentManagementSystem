import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Group name is required"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Group code is required"],
      unique: true,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
      default: "General",
    },
    facultyId: {
      type: String,
      required: [true, "Assigned Faculty ID is required"],
      trim: true,
    },
    facultyName: {
      type: String,
      trim: true,
      default: "",
    },
    studentIds: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export const Group = mongoose.model("Group", groupSchema);
