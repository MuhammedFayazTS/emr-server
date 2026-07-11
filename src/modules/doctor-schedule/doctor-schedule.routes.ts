import express from "express"
import { doctorScheduleController } from ".";
import { authorize } from "@/middleware/authorize";
import { PERMISSIONS } from "@/shared/constants/permissions";

const router = express.Router();

router.post("/", authorize(PERMISSIONS.SCHEDULE.CREATE), doctorScheduleController.createSchedule);
router.get("/", authorize(PERMISSIONS.SCHEDULE.VIEW), doctorScheduleController.getAllSchedules);
router.get("/doctor/:doctorId", authorize(PERMISSIONS.SCHEDULE.VIEW), doctorScheduleController.getScheduleByDoctorId);
router.get("/:id", authorize(PERMISSIONS.SCHEDULE.VIEW), doctorScheduleController.getScheduleById);
router.put("/:id", authorize(PERMISSIONS.SCHEDULE.UPDATE), doctorScheduleController.updateSchedule);
router.delete("/:id", authorize(PERMISSIONS.SCHEDULE.DELETE), doctorScheduleController.deleteSchedule);

export default router
