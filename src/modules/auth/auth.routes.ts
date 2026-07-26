import { Router } from "express";

import { authenticate } from "@/middleware/authenticate";
import { authRateLimiter } from "@/middleware/rate-limiter";
import { authController } from "@/modules/auth/index";

const router = Router();

router.post("/login", authRateLimiter, authController.login);
router.get("/refresh", authRateLimiter, authController.refreshToken);
router.get("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.getCurrentUser);

export default router;
