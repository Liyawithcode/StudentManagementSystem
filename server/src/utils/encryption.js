import crypto from "crypto";
import { config_ENV } from "../config/auth.config.js";

const ALGORITHM = "aes-256-cbc";
const SECRET = config_ENV.ACCESS_TOKEN_SECRET || "default_fallback_secret_key_long_enough_32bytes";
// Generate 32 bytes key from the secret
const KEY = crypto.createHash("sha256").update(SECRET).digest();

export const encrypt = (text) => {
  if (!text) return "";
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

export default encrypt;
