import { asyncHandler } from "@/middleware/async-handler";
import type AuditLogService from "@/modules/audit-log/audit-log.service";
import { AuditAction } from "@/modules/audit-log/audit-log.types";
import ApiResponse from "@/shared/utils/api-response";
import { commonQuerySchema, paramsIdSchema } from "@/shared/validators/common-validators";

import { createDoctorSchema, updateDoctorSchema } from "./doctor.validator";

import type DoctorService from "./doctor.service";
import type { Request, Response } from "express";

class DoctorController {
    private doctorService: DoctorService;
    private auditLogService?: AuditLogService;

    constructor(doctorService: DoctorService, auditLogService?: AuditLogService) {
        this.doctorService = doctorService;
        this.auditLogService = auditLogService;
    }

    createDoctor = asyncHandler(async (req: Request, res: Response) => {
        const body = createDoctorSchema.parse(req.body);
        const doctor = await this.doctorService.createDoctor(body);

        await this.auditLogService?.logChange({
            actorId: req.user?._id,
            actorType: req.user ? "USER" : "SYSTEM",
            action: AuditAction.CREATE,
            entityType: "Doctor",
            entityId: doctor.id,
            after: doctor,
            metadata: { ip: req.ip, userAgent: req.get("user-agent") },
        });

        return ApiResponse.created(res, "Doctor created successfully", doctor);
    });

    updateDoctor = asyncHandler(async (req: Request, res: Response) => {
        const body = updateDoctorSchema.parse(req.body);
        const { id } = paramsIdSchema.parse(req.params);
        const before = await this.doctorService.getDoctorById(id);
        const doctor = await this.doctorService.updateDoctor(id, body);

        await this.auditLogService?.logChange({
            actorId: req.user?._id,
            actorType: req.user ? "USER" : "SYSTEM",
            action: AuditAction.UPDATE,
            entityType: "Doctor",
            entityId: id,
            before,
            after: doctor,
            metadata: { ip: req.ip, userAgent: req.get("user-agent") },
        });

        return ApiResponse.ok(res, "Doctor updated successfully", doctor);
    });

    getAllDoctors = asyncHandler(async (req: Request, res: Response) => {
        const query = commonQuerySchema.parse(req.query);
        const result = await this.doctorService.getAllDoctors(query);
        return ApiResponse.ok(res, "Doctors fetched successfully", result.data, result.pagination);
    });

    getDoctorById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        const doctor = await this.doctorService.getDoctorById(id);
        return ApiResponse.ok(res, "Doctor fetched successfully", doctor);
    });

    deleteDoctor = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        const before = await this.doctorService.getDoctorById(id);
        await this.doctorService.deleteDoctor(id);

        await this.auditLogService?.logChange({
            actorId: req.user?._id,
            actorType: req.user ? "USER" : "SYSTEM",
            action: AuditAction.DELETE,
            entityType: "Doctor",
            entityId: id,
            before,
            metadata: { ip: req.ip, userAgent: req.get("user-agent") },
        });

        return ApiResponse.ok(res, "Doctor deleted successfully");
    });
}

export default DoctorController;
