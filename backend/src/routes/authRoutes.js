import { Router } from "express";
import { signup, login, getMe, changePassword } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", verifyToken, getMe);
router.put("/change-password", verifyToken, changePassword);

export default router;