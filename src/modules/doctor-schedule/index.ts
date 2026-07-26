import { auditLogService } from "@/modules/audit-log";

import DoctorScheduleController from "./doctor-schedule.controller";
import DoctorScheduleRepository from "./doctor-schedule.repository";
import DoctorScheduleService from "./doctor-schedule.service";

const doctorScheduleRepository = new DoctorScheduleRepository();
const doctorScheduleService = new DoctorScheduleService(doctorScheduleRepository);
const doctorScheduleController = new DoctorScheduleController(
    doctorScheduleService,
    auditLogService,
);

export {
    doctorScheduleRepository,
    doctorScheduleService,
    doctorScheduleController,
    DoctorScheduleRepository,
    DoctorScheduleService,
};
export { DoctorSchedule } from "./doctor-schedule.model";
export type {
    DoctorScheduleResponseDto,
    IDoctorSchedule,
    ISession,
    IWorkingDay,
} from "./doctor-schedule.types";
