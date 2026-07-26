import express from "express";

import { authorize } from "@/middleware/authorize";
import { PERMISSIONS } from "@/shared/constants/permissions";

import { patientController } from ".";

const router = express.Router();

router.post("/", authorize(PERMISSIONS.PATIENT.CREATE), patientController.createPatient);
router.get("/", authorize(PERMISSIONS.PATIENT.VIEW), patientController.searchPatients);
router.get("/:id", authorize(PERMISSIONS.PATIENT.VIEW), patientController.getPatientById);
router.put("/:id", authorize(PERMISSIONS.PATIENT.UPDATE), patientController.updatePatient);
router.patch(
    "/:id/status",
    authorize(PERMISSIONS.PATIENT.STATUS_UPDATE),
    patientController.updatePatientStatus,
);

export default router;
