import express from "express";

import { authorize } from "@/middleware/authorize";
import { PERMISSIONS } from "@/shared/constants/permissions";

import { slotController } from ".";

const router = express.Router();

router.get("/:doctorId", authorize(PERMISSIONS.SLOT.VIEW), slotController.generateSlots);

export default router;
