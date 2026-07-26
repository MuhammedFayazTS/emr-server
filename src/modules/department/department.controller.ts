import z from "zod";

import { asyncHandler } from "@/middleware/async-handler";
import type AuditLogService from "@/modules/audit-log/audit-log.service";
import { AuditAction } from "@/modules/audit-log/audit-log.types";
import ApiResponse from "@/shared/utils/api-response";
import { commonQuerySchema, paramsIdSchema } from "@/shared/validators/common-validators";

import { createDepartmentSchema } from "./department.validator";

import type DepartmentService from "./department.service";
import type { Request, Response } from "express";

class DepartmentController {
    private departmentService: DepartmentService;
    private auditLogService?: AuditLogService;

    constructor(departmentService: DepartmentService, auditLogService?: AuditLogService) {
        this.departmentService = departmentService;
        this.auditLogService = auditLogService;
    }

    public createDepartment = asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const body = createDepartmentSchema.parse(req.body);
        const department = await this.departmentService.createDepartment(body);

        await this.auditLogService?.logChange({
            actorId: req.user?._id,
            actorType: req.user ? "USER" : "SYSTEM",
            action: AuditAction.CREATE,
            entityType: "Department",
            entityId: department.id,
            after: department,
            metadata: { ip: req.ip, userAgent: req.get("user-agent") },
        });

        return ApiResponse.created(res, "Department created successfully", department);
    });

    public getDepartment = asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const { id } = paramsIdSchema.parse(req.params);
        const department = await this.departmentService.findById(id);
        return ApiResponse.ok(res, "Department fetched successfully", department);
    });

    public getAllDepartments = asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const query = commonQuerySchema.parse(req.query);
        const departments = await this.departmentService.findAll(query);
        return ApiResponse.ok(
            res,
            "Departments fetched successfully",
            departments.data,
            departments.pagination,
        );
    });

    public updateDepartment = asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const { id } = paramsIdSchema.parse(req.params);
        const before = await this.departmentService.findById(id);
        const department = await this.departmentService.updateDepartment(id, req.body);

        await this.auditLogService?.logChange({
            actorId: req.user?._id,
            actorType: req.user ? "USER" : "SYSTEM",
            action: AuditAction.UPDATE,
            entityType: "Department",
            entityId: id,
            before,
            after: department,
            metadata: { ip: req.ip, userAgent: req.get("user-agent") },
        });

        return ApiResponse.ok(res, "Department updated successfully", department);
    });

    public updateDepartmentStatus = asyncHandler(
        async (req: Request, res: Response): Promise<any> => {
            const { id } = paramsIdSchema.parse(req.params);
            const { isActive } = z.object({ isActive: z.boolean() }).parse(req.body);
            const before = await this.departmentService.findById(id);
            const department = await this.departmentService.updateDepartment(id, { isActive });

            await this.auditLogService?.logChange({
                actorId: req.user?._id,
                actorType: req.user ? "USER" : "SYSTEM",
                action: AuditAction.UPDATE,
                entityType: "Department",
                entityId: id,
                before,
                after: department,
                metadata: { ip: req.ip, userAgent: req.get("user-agent") },
            });

            return ApiResponse.ok(res, "Department status updated successfully", department);
        },
    );

    public deleteDepartment = asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const { id } = paramsIdSchema.parse(req.params);
        const before = await this.departmentService.findById(id);
        const department = await this.departmentService.deleteDepartment(id);

        await this.auditLogService?.logChange({
            actorId: req.user?._id,
            actorType: req.user ? "USER" : "SYSTEM",
            action: AuditAction.DELETE,
            entityType: "Department",
            entityId: id,
            before,
            metadata: { ip: req.ip, userAgent: req.get("user-agent") },
        });

        return ApiResponse.ok(res, "Department deleted successfully", department);
    });

    public restoreDepartment = asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const { id } = paramsIdSchema.parse(req.params);
        const department = await this.departmentService.restoreDepartment(id);

        await this.auditLogService?.logChange({
            actorId: req.user?._id,
            actorType: req.user ? "USER" : "SYSTEM",
            action: AuditAction.UPDATE,
            entityType: "Department",
            entityId: id,
            after: department,
            metadata: { ip: req.ip, userAgent: req.get("user-agent") },
        });

        return ApiResponse.ok(res, "Department restored successfully", department);
    });
}

export default DepartmentController;
