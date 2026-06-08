
import dotenv from "dotenv"

dotenv.config();

export const config_ENV = {
    PORT: process.env.PORT || 5000,
    MONGO_URL: process.env.MONGO_URL ,
    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRE_TIME: process.env.ACCESS_TOKEN_EXPIRE_TIME || "15m",
    REFRESH_TOKEN_EXPIRE_TIME: process.env.REFRESH_TOKEN_EXPIRE_TIME || "7d",
    NODE_ENV: process.env.NODE_ENV || "development",
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: parseInt(process.env.EMAIL_PORT) || 587,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    EMAIL_SECURE: process.env.EMAIL_SECURE || false
};

if (!config_ENV.PORT || !config_ENV.MONGO_URL) {
    console.error("Missing required environment variables. Please check your .env file.");
    process.exit(1);
}

if(!config_ENV.EMAIL_HOST || !config_ENV.EMAIL_USER || !config_ENV.EMAIL_PASS || !config_ENV.EMAIL_PORT) {
    console.error("Missing required email environment variables. Please check your .env file.");
    process.exit(1);
}


