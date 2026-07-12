import AppointmentController from "./appointment.controller";
import AppointmentRepository from "./appointment.repository";
import AppointmentService from "./appointment.service";
import { patientService } from "@modules/patient";
import { departmentService } from "@modules/department";
import { doctorService } from "@modules/doctor";
import { slotService } from "@modules/slot";

const appointmentRepository = new AppointmentRepository();
const appointmentService = new AppointmentService(
    appointmentRepository,
    doctorService,
    departmentService,
    patientService,
    slotService,
);
const appointmentController = new AppointmentController(appointmentService);

export { appointmentRepository, appointmentService, appointmentController, AppointmentRepository, AppointmentService };
