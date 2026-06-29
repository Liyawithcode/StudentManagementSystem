export const sanitize = (input) => {
  if (typeof input !== "string") return input;

  return input
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  const result = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof obj[key] === "object") {
        result[key] = sanitizeObject(obj[key]);
      } else {
        result[key] = sanitize(obj[key]);
      }
    }
  }
  return result;
};

export default {
  sanitize,
  sanitizeObject
};
