import fs from "fs/promises";
import path from "path";

export const uploadFile = async (fileBuffer, fileName, folder = "public/uploads") => {
  try {
    await fs.mkdir(folder, { recursive: true });
    const uniqueName = `${Date.now()}-${fileName}`;
    const filePath = path.join(folder, uniqueName);
    await fs.writeFile(filePath, fileBuffer);
    return {
      success: true,
      filePath: `/${folder}/${uniqueName}`,
      fileName: uniqueName,
    };
  } catch (error) {
    console.error("Upload file utility error:", error);
    throw new Error("File upload failed: " + error.message);
  }
};

export default uploadFile;
