import path from "path";

export const validateFile = (fileName, mimeType, fileSize = 0, allowedExtensions = ["jpg", "jpeg", "png", "gif", "pdf"], maxSize = 5 * 1024 * 1024) => {
  const ext = path.extname(fileName).toLowerCase().substring(1);
  
  if (!allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `Invalid file extension. Allowed extensions are: ${allowedExtensions.join(", ")}`
    };
  }

  if (fileSize > maxSize) {
    return {
      valid: false,
      error: `File size exceeds limit of ${(maxSize / (1024 * 1024)).toFixed(1)}MB`
    };
  }

  return { valid: true };
};

export default validateFile;
