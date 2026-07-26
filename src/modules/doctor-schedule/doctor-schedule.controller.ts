import { asyncHandler } from "@/middleware/async-handler";
import type AuditLogService from "@/modules/audit-log/audit-log.service";
import { AuditAction } from "@/modules/audit-log/audit-log.types";
import ApiResponse from "@/shared/utils/api-response";
import {
    commonQuerySchema,
    paramsDoctorIdSchema,
    paramsIdSchema,
} from "@/shared/validators/common-validators";

import {
    createDoctorScheduleSchema,
    updateDoctorScheduleSchema,
} from "./doctor-schedule.validator";

import type DoctorScheduleService from "./doctor-schedule.service";
import type { Request, Response } from "express";

class DoctorScheduleController {
    private scheduleService: DoctorScheduleService;
    private auditLogService?: AuditLogService;

    constructor(scheduleService: DoctorScheduleService, auditLogService?: AuditLogService) {
        this.scheduleService = scheduleService;
        this.auditLogService = auditLogService;
    }

    createSchedule = asyncHandler(async (req: Request, res: Response) => {
        const body = createDoctorScheduleSchema.parse(req.body);
        const schedule = await this.scheduleService.createSchedule(body);

        await this.auditLogService?.logChange({
            actorId: req.user?._id,
            actorType: req.user ? "USER" : "SYSTEM",
            action: AuditAction.CREATE,
            entityType: "DoctorSchedule",
            entityId: schedule.id,
            after: schedule,
            metadata: { ip: req.ip, userAgent: req.get("user-agent") },
        });

        return ApiResponse.created(res, "Doctor schedule created successfully", schedule);
    });

    updateSchedule = asyncHandler(async (req: Request, res: Response) => {
        const body = updateDoctorScheduleSchema.parse(req.body);
        const { id } = paramsIdSchema.parse(req.params);
        const before = await this.scheduleService.getScheduleById(id);
        const schedule = await this.scheduleService.updateSchedule(id, body);

        await this.auditLogService?.logChange({
            actorId: req.user?._id,
            actorType: req.user ? "USER" : "SYSTEM",
            action: AuditAction.UPDATE,
            entityType: "DoctorSchedule",
            entityId: id,
            before,
            after: schedule,
            metadata: { ip: req.ip, userAgent: req.get("user-agent") },
        });

        return ApiResponse.ok(res, "Doctor schedule updated successfully", schedule);
    });

    getAllSchedules = asyncHandler(async (req: Request, res: Response) => {
        const query = commonQuerySchema.parse(req.query);
        const result = await this.scheduleService.getAllSchedules(query);
        return ApiResponse.ok(
            res,
            "Doctor schedules fetched successfully",
            result.data,
            result.pagination,
        );
    });

    getScheduleById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        const schedule = await this.scheduleService.getScheduleById(id);
        return ApiResponse.ok(res, "Doctor schedule fetched successfully", schedule);
    });

    getScheduleByDoctorId = asyncHandler(async (req: Request, res: Response) => {
        const { doctorId } = paramsDoctorIdSchema.parse(req.params);
        const schedule = await this.scheduleService.getScheduleByDoctorId(doctorId);
        return ApiResponse.ok(res, "Doctor schedule fetched successfully", schedule);
    });

    deleteSchedule = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        const before = await this.scheduleService.getScheduleById(id);
        await this.scheduleService.deleteSchedule(id);

        await this.auditLogService?.logChange({
            actorId: req.user?._id,
            actorType: req.user ? "USER" : "SYSTEM",
            action: AuditAction.DELETE,
            entityType: "DoctorSchedule",
            entityId: id,
            before,
            metadata: { ip: req.ip, userAgent: req.get("user-agent") },
        });

        return ApiResponse.ok(res, "Doctor schedule deleted successfully");
    });
}

export default DoctorScheduleController;
