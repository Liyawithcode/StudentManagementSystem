import mongoose from "mongoose";
import { config_ENV } from "../config/auth.config.js";

export const connectDB = async () => {
   try {
      await mongoose.connect(config_ENV.MONGO_URL);
      console.log("Connected to MongoDB");
   } catch (error) {
      console.error("Failed to connect to MongoDB", error);
      process.exit(1);
      next();
   }
}