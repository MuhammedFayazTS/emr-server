import SlotService from "./slot.service";
import { ISlot } from "./slot.types";
import SlotController from "./slot.controller";
import { doctorScheduleService } from "../doctor-schedule";

const slotService = new SlotService(doctorScheduleService);
const slotController = new SlotController(slotService);

export { slotController, slotService, ISlot };