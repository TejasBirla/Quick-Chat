import express from "express";
import {
  checkAuth,
  deleteProfile,
  forgotPassword,
  login,
  resetPassword,
  Signup,
  updateProfile,
  verifyOtp,
} from "../controllers/userController.js";
import { protectRoute } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", Signup);
userRouter.post("/login", login);
userRouter.put("/update/profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, checkAuth);
userRouter.delete("/delete/profile", protectRoute, deleteProfile);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/verify-otp",verifyOtp);
userRouter.post("/reset-password", resetPassword);

export default userRouter;
