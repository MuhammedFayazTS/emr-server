import { Router } from "express";

import { authenticate } from "@/middleware/authenticate";

import authRoutes from "@/modules/auth/auth.routes";
import departmentRoutes from "@/modules/department/department.routes";
import doctorRoutes from "@/modules/doctor/doctor.routes";
import doctorScheduleRoutes from "@/modules/doctor-schedule/doctor-schedule.routes";
import receptionistRoutes from "@/modules/receptionist/receptionist.routes";
import userRoutes from "@/modules/user/user.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/departments", authenticate, departmentRoutes);
router.use("/doctors", authenticate, doctorRoutes);
router.use("/doctor-schedules", authenticate, doctorScheduleRoutes);
router.use("/receptionists", authenticate, receptionistRoutes);
router.use("/users", authenticate, userRoutes);

export default router;