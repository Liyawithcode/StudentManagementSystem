import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Announcement title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Announcement content is required"],
      trim: true,
    },
    audience: {
      type: String,
      required: true,
      enum: ["All", "Students", "Faculty", "Parents"],
      default: "All",
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    sentEmail: {
      type: Boolean,
      default: false,
    },
    isLeaveNotice: {
      type: Boolean,
      default: false,
    },
    facultyId: {
      type: String,
      default: "",
    },
    groupId: {
      type: String,
      default: "",
    },
    groupName: {
      type: String,
      default: "",
    },
    targetStudentIds: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export const Announcement = mongoose.model("Announcement", announcementSchema);
