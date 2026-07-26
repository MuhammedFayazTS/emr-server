import { asyncHandler } from "@/middleware/async-handler";
import type AuditLogService from "@/modules/audit-log/audit-log.service";
import { AuditAction } from "@/modules/audit-log/audit-log.types";
import { BadRequestError } from "@/shared/errors/CommonExceptions";
import ApiResponse from "@/shared/utils/api-response";
import { paramsIdSchema } from "@/shared/validators/common-validators";

import { createPatientSchema, searchPatientSchema, updatePatientSchema } from "./patient.validator";

import type PatientService from "./patient.service";
import type { Request, Response } from "express";

class PatientController {
    private patientService: PatientService;
    private auditLogService?: AuditLogService;

    constructor(patientService: PatientService, auditLogService?: AuditLogService) {
        this.patientService = patientService;
        this.auditLogService = auditLogService;
    }

    createPatient = asyncHandler(async (req: Request, res: Response) => {
        const body = createPatientSchema.parse(req.body);
        const createdBy = req.user!._id.toString();
        const patient = await this.patientService.createPatient(body, createdBy);

        await this.auditLogService?.logChange({
            actorId: req.user?._id,
            actorType: req.user ? "USER" : "SYSTEM",
            action: AuditAction.CREATE,
            entityType: "Patient",
            entityId: patient.id,
            after: patient,
            metadata: { ip: req.ip, userAgent: req.get("user-agent") },
        });

        return ApiResponse.created(res, "Patient created successfully", patient);
    });

    getPatientById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        const patient = await this.patientService.getPatientById(id);
        return ApiResponse.ok(res, "Patient fetched successfully", patient);
    });

    searchPatients = asyncHandler(async (req: Request, res: Response) => {
        const query = searchPatientSchema.parse(req.query);
        const result = await this.patientService.getPatients(query);
        return ApiResponse.ok(res, "Patients fetched successfully", result.data, result.pagination);
    });

    updatePatient = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        const body = updatePatientSchema.parse(req.body);
        const updatedBy = req.user!._id.toString();
        const before = await this.patientService.getPatientById(id);
        const patient = await this.patientService.updatePatient(id, body, updatedBy);

        await this.auditLogService?.logChange({
            actorId: req.user?._id,
            actorType: req.user ? "USER" : "SYSTEM",
            action: AuditAction.UPDATE,
            entityType: "Patient",
            entityId: id,
            before,
            after: patient,
            metadata: { ip: req.ip, userAgent: req.get("user-agent") },
        });

        return ApiResponse.ok(res, "Patient updated successfully", patient);
    });

    updatePatientStatus = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        const { isActive } = req.body;
        if (typeof isActive !== "boolean") throw new BadRequestError("Invalid status");
        const before = await this.patientService.getPatientById(id);
        const patient = await this.patientService.updatePatientStatus(id, isActive);

        await this.auditLogService?.logChange({
            actorId: req.user?._id,
            actorType: req.user ? "USER" : "SYSTEM",
            action: AuditAction.UPDATE,
            entityType: "Patient",
            entityId: id,
            before,
            after: patient,
            metadata: { ip: req.ip, userAgent: req.get("user-agent") },
        });

        return ApiResponse.ok(res, "Patient status updated successfully", patient);
    });
}

export default PatientController;
