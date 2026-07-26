import { asyncHandler } from "@/middleware/async-handler";
import type AuditLogService from "@/modules/audit-log/audit-log.service";
import { AuditAction } from "@/modules/audit-log/audit-log.types";
import ApiResponse from "@/shared/utils/api-response";
import { paramsIdSchema } from "@/shared/validators/common-validators";

import {
    cancelAppointmentSchema,
    createAppointmentSchema,
    rescheduleAppointmentSchema,
    searchAppointmentSchema,
    updateAppointmentSchema,
} from "./appointment.validator";

import type AppointmentService from "./appointment.service";
import type { Request, Response } from "express";

class AppointmentController {
    private appointmentService: AppointmentService;
    private auditLogService?: AuditLogService;

    constructor(appointmentService: AppointmentService, auditLogService?: AuditLogService) {
        this.appointmentService = appointmentService;
        this.auditLogService = auditLogService;
    }

    createAppointment = asyncHandler(async (req: Request, res: Response) => {
        const body = createAppointmentSchema.parse(req.body);
        const appointment = await this.appointmentService.createAppointment(body);

        await this.auditLogService?.logChange({
            actorId: req.user?._id,
            actorType: req.user ? "USER" : "SYSTEM",
            action: AuditAction.CREATE,
            entityType: "Appointment",
            entityId: appointment.id,
            after: appointment,
            metadata: { ip: req.ip, userAgent: req.get("user-agent") },
        });

        return ApiResponse.created(res, "Appointment created successfully", appointment);
    });

    getAppointmentById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        const appointment = await this.appointmentService.getAppointmentById(id);
        return ApiResponse.ok(res, "Appointment fetched successfully", appointment);
    });

    getAllAppointments = asyncHandler(async (req: Request, res: Response) => {
        const query = searchAppointmentSchema.parse(req.query);
        const result = await this.appointmentService.getAllAppointments(query);
        return ApiResponse.ok(
            res,
            "Appointments fetched successfully",
            result.data,
            result.pagination,
        );
    });

    updateAppointment = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        const body = updateAppointmentSchema.parse(req.body);
        const before = await this.appointmentService.getAppointmentById(id);
        const appointment = await this.appointmentService.updateAppointment(id, body);

        await this.auditLogService?.logChange({
            actorId: req.user?._id,
            actorType: req.user ? "USER" : "SYSTEM",
            action: AuditAction.UPDATE,
            entityType: "Appointment",
            entityId: id,
            before,
            after: appointment,
            metadata: { ip: req.ip, userAgent: req.get("user-agent") },
        });

        return ApiResponse.ok(res, "Appointment updated successfully", appointment);
    });

    cancelAppointment = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        const body = cancelAppointmentSchema.parse(req.body);
        const cancelledBy = req.user!._id.toString();
        const before = await this.appointmentService.getAppointmentById(id);
        const appointment = await this.appointmentService.cancelAppointment(id, cancelledBy, body);

        await this.auditLogService?.logChange({
            actorId: req.user?._id,
            actorType: req.user ? "USER" : "SYSTEM",
            action: AuditAction.UPDATE,
            entityType: "Appointment",
            entityId: id,
            before,
            after: appointment,
            metadata: { ip: req.ip, userAgent: req.get("user-agent") },
        });

        return ApiResponse.ok(res, "Appointment cancelled successfully", appointment);
    });

    arriveAppointment = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        const before = await this.appointmentService.getAppointmentById(id);
        const appointment = await this.appointmentService.arriveAppointment(id);

        await this.auditLogService?.logChange({
            actorId: req.user?._id,
            actorType: req.user ? "USER" : "SYSTEM",
            action: AuditAction.UPDATE,
            entityType: "Appointment",
            entityId: id,
            before,
            after: appointment,
            metadata: { ip: req.ip, userAgent: req.get("user-agent") },
        });

        return ApiResponse.ok(res, "Appointment marked as arrived", appointment);
    });

    completeAppointment = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        const before = await this.appointmentService.getAppointmentById(id);
        const appointment = await this.appointmentService.completeAppointment(id);

        await this.auditLogService?.logChange({
            actorId: req.user?._id,
            actorType: req.user ? "USER" : "SYSTEM",
            action: AuditAction.UPDATE,
            entityType: "Appointment",
            entityId: id,
            before,
            after: appointment,
            metadata: { ip: req.ip, userAgent: req.get("user-agent") },
        });

        return ApiResponse.ok(res, "Appointment completed successfully", appointment);
    });

    rescheduleAppointment = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        const body = rescheduleAppointmentSchema.parse(req.body);
        const before = await this.appointmentService.getAppointmentById(id);
        const appointment = await this.appointmentService.rescheduleAppointment(id, body);

        await this.auditLogService?.logChange({
            actorId: req.user?._id,
            actorType: req.user ? "USER" : "SYSTEM",
            action: AuditAction.UPDATE,
            entityType: "Appointment",
            entityId: id,
            before,
            after: appointment,
            metadata: { ip: req.ip, userAgent: req.get("user-agent") },
        });

        return ApiResponse.ok(res, "Appointment rescheduled successfully", appointment);
    });
}

export default AppointmentController;
