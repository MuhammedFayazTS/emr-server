import { auditLogService } from "@/modules/audit-log";

import PatientController from "./patient.controller";
import PatientRepository from "./patient.repository";
import PatientService from "./patient.service";

const patientRepository = new PatientRepository();
const patientService = new PatientService(patientRepository);
const patientController = new PatientController(patientService, auditLogService);

export { patientRepository, patientService, patientController, PatientRepository, PatientService };
