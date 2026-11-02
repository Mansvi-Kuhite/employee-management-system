import { Router } from "express";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";
import {
  listDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController.js";

const router = Router();

router.use(verifyToken, requireRole("admin"));

router.get("/", listDepartments);
router.post("/", createDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

export default router;