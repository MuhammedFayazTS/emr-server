import { Router } from "express";

import { authenticate } from "@/middleware/authenticate";

import authRoutes from "@/modules/auth/auth.routes";
import departmentRoutes from "@/modules/department/department.routes";
import userRoutes from "@/modules/user/user.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/departments", authenticate, departmentRoutes);
router.use("/users", authenticate, userRoutes);

export default router;