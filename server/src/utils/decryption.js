import crypto from "crypto";
import { config_ENV } from "../config/auth.config.js";

const ALGORITHM = "aes-256-cbc";
const SECRET = config_ENV.ACCESS_TOKEN_SECRET || "default_fallback_secret_key_long_enough_32bytes";
const KEY = crypto.createHash("sha256").update(SECRET).digest();

export const decrypt = (encryptedText) => {
  if (!encryptedText) return "";
  try {
    const [ivHex, encrypted] = encryptedText.split(":");
    if (!ivHex || !encrypted) return "";
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error.message);
    return "";
  }
};

export default decrypt;
