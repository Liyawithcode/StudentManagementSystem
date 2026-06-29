import fs from "fs/promises";
import path from "path";

export const deleteFile = async (filePath) => {
  try {
    if (!filePath) return false;
    // If it's a relative web path like /public/uploads/..., translate to disk path
    let diskPath = filePath;
    if (filePath.startsWith("/")) {
      diskPath = filePath.substring(1);
    }
    const absolutePath = path.resolve(diskPath);
    
    try {
      await fs.access(absolutePath);
    } catch {
      return false; // File does not exist
    }

    await fs.unlink(absolutePath);
    return true;
  } catch (error) {
    console.error("Delete file error:", error);
    return false;
  }
};

export default deleteFile;
