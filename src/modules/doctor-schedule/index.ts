import DoctorScheduleController from "./doctor-schedule.controller";
import DoctorScheduleRepository from "./doctor-schedule.repository";
import DoctorScheduleService from "./doctor-schedule.service";

const doctorScheduleRepository = new DoctorScheduleRepository();
const doctorScheduleService = new DoctorScheduleService(doctorScheduleRepository);
const doctorScheduleController = new DoctorScheduleController(doctorScheduleService);

export {
    doctorScheduleRepository,
    doctorScheduleService,
    doctorScheduleController,
    DoctorScheduleRepository,
    DoctorScheduleService,
};
export { DoctorSchedule } from "./doctor-schedule.model";
export type {
    IDoctorSchedule,
    IWorkingDay,
    ISession,
    DoctorScheduleResponseDto,
} from "./doctor-schedule.types";
