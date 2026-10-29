import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import rateLimit from "express-rate-limit";
import {
  signup, login, getMe, changePassword,
  forgotPassword, verifyResetToken, resetPassword,
} from "../controllers/authController.js";

const forgotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", verifyToken, getMe);
router.put("/change-password", verifyToken, changePassword);
router.post("/forgot-password", forgotLimiter, forgotPassword);
router.get("/reset-password/verify", verifyResetToken);
router.post("/reset-password", resetPassword);

export default router;