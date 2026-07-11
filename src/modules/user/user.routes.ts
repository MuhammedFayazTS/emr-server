import express from "express"
import { userController } from ".";
import { authorize } from "@/middleware/authorize";
import { PERMISSIONS } from "@/shared/constants/permissions";

const router = express.Router();

// TODO: create seperate modules for doctor, receptionist and super-admin

// doctor routes
router.post("/doctors", authorize(PERMISSIONS.DOCTOR.CREATE), userController.createDoctor);
router.get("/doctors", authorize(PERMISSIONS.DOCTOR.VIEW), userController.getAllDoctors);
router.get("/doctors/:id", authorize(PERMISSIONS.DOCTOR.VIEW), userController.getDoctorById);
router.put("/doctors/:id", authorize(PERMISSIONS.DOCTOR.UPDATE), userController.updateDoctor);
router.delete("/doctors/:id", authorize(PERMISSIONS.DOCTOR.DELETE), userController.deleteDoctor);

export default router