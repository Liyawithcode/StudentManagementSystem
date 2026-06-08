import express from "express";
import morgan from "morgan";
import { authRouter } from "./routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config_ENV } from "./config/auth.config.js";
import { errorMiddleware } from "./middleware/auth.middleware.js";

export const app = express();

app.use(cors({
    origin: [config_ENV.CLIENT_URL],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if(config_ENV.NODE_ENV === "development") {
    app.use(morgan("dev"));
}


app.use("/api/auth", authRouter);
app.use("/", authRouter); // Alias to support /register directly


app.use(errorMiddleware);