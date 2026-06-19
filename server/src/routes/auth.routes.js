import express from "express";
import { login, verifyOtp, resendOtp, refreshToken, logout } from "../controller/auth.controller.js";
import { getMyProfile, updateMyProfile } from "../controller/profile.controller.js";
import { protect } from "../middleware/auth.middleware.js";

export const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/resend-otp", resendOtp);
authRouter.post("/refresh-token", refreshToken);
authRouter.post("/logout", logout);

authRouter.route("/profile")
    .get(protect, getMyProfile)
    .put(protect, updateMyProfile);
