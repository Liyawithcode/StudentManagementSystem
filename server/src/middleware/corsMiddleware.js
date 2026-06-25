import cors from "cors";
import { config_ENV } from "../config/auth.config.js";

/**
 * Pre-configured CORS middleware using system environmental properties.
 */
export const corsMiddleware = cors({
    origin: [config_ENV.CLIENT_URL],
    credentials: true
});
