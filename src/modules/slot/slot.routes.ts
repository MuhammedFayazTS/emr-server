import express from "express";
import { slotController } from ".";
import { authorize } from "@/middleware/authorize";
import { PERMISSIONS } from "@/shared/constants/permissions";

const router = express.Router();

router.get("/:doctorId", authorize(PERMISSIONS.SLOT.VIEW), slotController.generateSlots);

export default router