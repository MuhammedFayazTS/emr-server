import { asyncHandler } from "@/middleware/async-handler";
import type AuditLogService from "@/modules/audit-log/audit-log.service";
import { AuditAction } from "@/modules/audit-log/audit-log.types";
import ApiResponse from "@/shared/utils/api-response";
import { commonQuerySchema, paramsIdSchema } from "@/shared/validators/common-validators";

import { createReceptionistSchema, updateReceptionistSchema } from "./receptionist.validator";

import type ReceptionistService from "./receptionist.service";
import type { Request, Response } from "express";

class ReceptionistController {
    private receptionistService: ReceptionistService;
    private auditLogService?: AuditLogService;

    constructor(receptionistService: ReceptionistService, auditLogService?: AuditLogService) {
        this.receptionistService = receptionistService;
        this.auditLogService = auditLogService;
    }

    createReceptionist = asyncHandler(async (req: Request, res: Response) => {
        const body = createReceptionistSchema.parse(req.body);
        const receptionist = await this.receptionistService.createReceptionist(body);

        await this.auditLogService?.logChange({
            actorId: req.user?._id,
            actorType: req.user ? "USER" : "SYSTEM",
            action: AuditAction.CREATE,
            entityType: "Receptionist",
            entityId: receptionist.id,
            after: receptionist,
            metadata: { ip: req.ip, userAgent: req.get("user-agent") },
        });

        return ApiResponse.created(res, "Receptionist created successfully", receptionist);
    });

    updateReceptionist = asyncHandler(async (req: Request, res: Response) => {
        const body = updateReceptionistSchema.parse(req.body);
        const { id } = paramsIdSchema.parse(req.params);
        const before = await this.receptionistService.getReceptionistById(id);
        const receptionist = await this.receptionistService.updateReceptionist(id, body);

        await this.auditLogService?.logChange({
            actorId: req.user?._id,
            actorType: req.user ? "USER" : "SYSTEM",
            action: AuditAction.UPDATE,
            entityType: "Receptionist",
            entityId: id,
            before,
            after: receptionist,
            metadata: { ip: req.ip, userAgent: req.get("user-agent") },
        });

        return ApiResponse.ok(res, "Receptionist updated successfully", receptionist);
    });

    getAllReceptionists = asyncHandler(async (req: Request, res: Response) => {
        const query = commonQuerySchema.parse(req.query);
        const result = await this.receptionistService.getAllReceptionists(query);
        return ApiResponse.ok(
            res,
            "Receptionists fetched successfully",
            result.data,
            result.pagination,
        );
    });

    getReceptionistById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        const receptionist = await this.receptionistService.getReceptionistById(id);
        return ApiResponse.ok(res, "Receptionist fetched successfully", receptionist);
    });

    deleteReceptionist = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        const before = await this.receptionistService.getReceptionistById(id);
        await this.receptionistService.deleteReceptionist(id);

        await this.auditLogService?.logChange({
            actorId: req.user?._id,
            actorType: req.user ? "USER" : "SYSTEM",
            action: AuditAction.DELETE,
            entityType: "Receptionist",
            entityId: id,
            before,
            metadata: { ip: req.ip, userAgent: req.get("user-agent") },
        });

        return ApiResponse.ok(res, "Receptionist deleted successfully");
    });
}

export default ReceptionistController;
