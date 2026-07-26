import { auditLogService } from "@/modules/audit-log";

import DoctorController from "./doctor.controller";
import DoctorRepository from "./doctor.repository";
import DoctorService from "./doctor.service";

const doctorRepository = new DoctorRepository();
const doctorService = new DoctorService(doctorRepository);
const doctorController = new DoctorController(doctorService, auditLogService);

export { doctorRepository, doctorService, doctorController, DoctorRepository, DoctorService };
