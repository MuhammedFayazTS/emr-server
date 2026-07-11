import { Router } from "express";

import authRoutes from "@/modules/auth/auth.routes";
import departmentRoutes from "@/modules/department/department.routes";
import { authenticate } from "@/middleware/authenticate";

const router = Router();

router.use("/auth", authRoutes);
router.use("/departments", authenticate, departmentRoutes);

export default router;