import express from "express";

import { authorize } from "@/middleware/authorize";
import { PERMISSIONS } from "@/shared/constants/permissions";

import { doctorController } from ".";

const router = express.Router();

router.post("/", authorize(PERMISSIONS.DOCTOR.CREATE), doctorController.createDoctor);
router.get("/", authorize(PERMISSIONS.DOCTOR.VIEW), doctorController.getAllDoctors);
router.get("/:id", authorize(PERMISSIONS.DOCTOR.VIEW), doctorController.getDoctorById);
router.put("/:id", authorize(PERMISSIONS.DOCTOR.UPDATE), doctorController.updateDoctor);
router.delete("/:id", authorize(PERMISSIONS.DOCTOR.DELETE), doctorController.deleteDoctor);

export default router;
