import AppointmentController from "./appointment.controller";
import AppointmentRepository from "./appointment.repository";
import AppointmentService from "./appointment.service";
import SlotService from "../slot/slot.service";
import { doctorScheduleService } from "../doctor-schedule";
import { patientService } from "../patient";
import { departmentService } from "../department";
import { doctorService } from "../doctor";

const appointmentRepository = new AppointmentRepository();
const slotService = new SlotService(doctorScheduleService, appointmentRepository);
const appointmentService = new AppointmentService(
    appointmentRepository,
    doctorService,
    departmentService,
    patientService,
    slotService,
);
const appointmentController = new AppointmentController(appointmentService);

export {
    appointmentRepository,
    appointmentService,
    appointmentController,
    AppointmentRepository,
    AppointmentService,
    AppointmentController,
};
