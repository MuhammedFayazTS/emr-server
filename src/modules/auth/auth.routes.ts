import { Router } from "express";
import { authController } from "@/modules/auth/index";

const router = Router();

router.post("/login", authController.login);
router.get("/refresh", authController.refreshToken);

export default router;