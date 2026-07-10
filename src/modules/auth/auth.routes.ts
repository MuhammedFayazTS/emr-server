import { Router } from "express";
import { authController } from "@/modules/auth/index";
import { authenticate } from "@/middleware/authenticate";

const router = Router();

router.post("/login", authController.login);
router.get("/refresh", authController.refreshToken);
router.get("/logout", authenticate, authController.logout);

export default router;