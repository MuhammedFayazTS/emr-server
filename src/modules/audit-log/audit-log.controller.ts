import { asyncHandler } from "@/middleware/async-handler";
import ApiResponse from "@/shared/utils/api-response";

import { auditLogQuerySchema } from "./audit-log.validator";

import type AuditLogService from "./audit-log.service";
import type { Request, Response } from "express";

class AuditLogController {
    private auditLogService: AuditLogService;

    constructor(auditLogService: AuditLogService) {
        this.auditLogService = auditLogService;
    }

    public getAuditLogs = asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const query = auditLogQuerySchema.parse(req.query);
        const result = await this.auditLogService.find(query);
        return ApiResponse.ok(res, "Audit logs fetched successfully", result.data, {
            page: result.page,
            totalPages: result.totalPages,
            total: result.total,
        });
    });

    public getEntityAuditLogs = asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const entityType = String(req.params.entityType);
        const entityId = String(req.params.entityId);
        const logs = await this.auditLogService.findByEntity(entityType, entityId);
        return ApiResponse.ok(res, "Entity audit logs fetched successfully", logs);
    });
}

export default AuditLogController;
