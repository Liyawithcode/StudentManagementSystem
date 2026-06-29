import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "mock_cloud",
  api_key: process.env.CLOUDINARY_API_KEY || "mock_key",
  api_secret: process.env.CLOUDINARY_API_SECRET || "mock_secret"
});

export const uploadOnCloudinary = async (localFilePath, folderName = "student-management") => {
  try {
    if (!localFilePath) return null;

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      console.log(`[Cloudinary Mock] Uploading ${localFilePath} to folder ${folderName}`);
      return {
        secure_url: `/mock-cloudinary-url/${localFilePath.split(/[\\/]/).pop()}`,
        public_id: `stub_${Date.now()}`
      };
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folderName
    });

    try {
      await fs.unlink(localFilePath);
    } catch (e) {}

    return response;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    try {
      await fs.unlink(localFilePath);
    } catch (e) {}
    return null;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    if (publicId.startsWith("stub_")) {
      console.log(`[Cloudinary Mock] Deleting ID: ${publicId}`);
      return { result: "ok" };
    }
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary deletion failed:", error);
    return null;
  }
};

export default {
  uploadOnCloudinary,
  deleteFromCloudinary
};
