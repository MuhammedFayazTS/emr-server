import express from "express"
import { receptionistController } from ".";
import { authorize } from "@/middleware/authorize";
import { PERMISSIONS } from "@/shared/constants/permissions";

const router = express.Router();

router.post("/", authorize(PERMISSIONS.RECEPTIONIST.CREATE), receptionistController.createReceptionist);
router.get("/", authorize(PERMISSIONS.RECEPTIONIST.VIEW), receptionistController.getAllReceptionists);
router.get("/:id", authorize(PERMISSIONS.RECEPTIONIST.VIEW), receptionistController.getReceptionistById);
router.put("/:id", authorize(PERMISSIONS.RECEPTIONIST.UPDATE), receptionistController.updateReceptionist);
router.delete("/:id", authorize(PERMISSIONS.RECEPTIONIST.DELETE), receptionistController.deleteReceptionist);

export default router
