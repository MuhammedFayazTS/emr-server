import SlotController from "./slot.controller";
import { doctorScheduleService } from "../doctor-schedule";
import { appointmentRepository } from "../appointment";
import SlotService from "./slot.service";

const slotService = new SlotService(doctorScheduleService, appointmentRepository);
const slotController = new SlotController(slotService);

export { slotService, slotController };
