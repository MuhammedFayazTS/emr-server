import { auditLogService } from "@/modules/audit-log";

import { appointmentRepository } from "../appointment";
import { doctorScheduleService } from "../doctor-schedule";

import SlotController from "./slot.controller";
import SlotService from "./slot.service";

const slotService = new SlotService(doctorScheduleService, appointmentRepository);
const slotController = new SlotController(slotService, auditLogService);

export { slotService, slotController };
