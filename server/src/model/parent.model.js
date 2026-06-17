import mongoose from "mongoose";

const parentSchema = new mongoose.Schema(
  {
    parentFullName: {
      type: String,
      required: [true, "Parent full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    studentIds: [
      {
        type: String,
        trim: true,
      },
    ],
    role: {
      type: String,
      enum: ["parent"],
      default: "parent",
    },
  },
  { timestamps: true }
);

export const Parent = mongoose.model("Parent", parentSchema);
