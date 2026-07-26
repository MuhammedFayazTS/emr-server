import express from "express";

import { authorize } from "@/middleware/authorize";
import { PERMISSIONS } from "@/shared/constants/permissions";

import { appointmentController } from ".";

const router = express.Router();

router.post(
    "/",
    authorize(PERMISSIONS.APPOINTMENT.CREATE),
    appointmentController.createAppointment,
);
router.get("/", authorize(PERMISSIONS.APPOINTMENT.VIEW), appointmentController.getAllAppointments);
router.get(
    "/:id",
    authorize(PERMISSIONS.APPOINTMENT.VIEW),
    appointmentController.getAppointmentById,
);
router.patch(
    "/:id",
    authorize(PERMISSIONS.APPOINTMENT.UPDATE),
    appointmentController.updateAppointment,
);
router.patch(
    "/:id/cancel",
    authorize(PERMISSIONS.APPOINTMENT.CANCEL),
    appointmentController.cancelAppointment,
);
router.patch(
    "/:id/arrive",
    authorize(PERMISSIONS.APPOINTMENT.ARRIVE),
    appointmentController.arriveAppointment,
);
router.patch(
    "/:id/complete",
    authorize(PERMISSIONS.APPOINTMENT.UPDATE),
    appointmentController.completeAppointment,
);
router.patch(
    "/:id/reschedule",
    authorize(PERMISSIONS.APPOINTMENT.UPDATE),
    appointmentController.rescheduleAppointment,
);

export default router;
