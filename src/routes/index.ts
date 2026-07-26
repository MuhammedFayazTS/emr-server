import { Router } from "express";

import { authenticate } from "@/middleware/authenticate";
import authRoutes from "@/modules/auth/auth.routes";
import departmentRoutes from "@/modules/department/department.routes";
import doctorRoutes from "@/modules/doctor/doctor.routes";
import doctorScheduleRoutes from "@/modules/doctor-schedule/doctor-schedule.routes";
import receptionistRoutes from "@/modules/receptionist/receptionist.routes";
import userRoutes from "@/modules/user/user.routes";
import slotRoutes from "@/modules/slot/slot.routes";
import patientRoutes from "@/modules/patient/patient.routes";
import appointmentRoutes from "@/modules/appointment/appointment.routes";
import healthCheckRoutes from "@/routes/health-check.route";

const router = Router();

router.use("/health-check", healthCheckRoutes);
router.use("/auth", authRoutes);
router.use("/departments", authenticate, departmentRoutes);
router.use("/doctors", authenticate, doctorRoutes);
router.use("/doctor-schedules", authenticate, doctorScheduleRoutes);
router.use("/receptionists", authenticate, receptionistRoutes);
router.use("/users", authenticate, userRoutes);
router.use("/slots", authenticate, slotRoutes);
router.use("/patients", authenticate, patientRoutes);
router.use("/appointments", authenticate, appointmentRoutes);

export default router;
