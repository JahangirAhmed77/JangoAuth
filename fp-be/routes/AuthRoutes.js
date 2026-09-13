import express from "express";
import {
  signup,
  sendVerificationOtp,
  verifyOtp,
  login,
  sendResetOtp,
  verifyResetOtp,
  resetPassword,
  getUserData,
  isAuth,
} from "../controllers/AuthControllers.js";
import { authCheck } from "../middleware/auth.js";

export const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/send-verification-otp", authCheck, sendVerificationOtp);
authRouter.post("/verify-otp", authCheck, verifyOtp);
authRouter.post("/login", login);
authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/verify-reset-otp", verifyResetOtp);
authRouter.post("/reset-password", resetPassword);
authRouter.get("/user-data", authCheck, getUserData);
authRouter.get("/is-auth", authCheck, isAuth);