import z from "zod";
import { objectIdSchema, dateSchema } from "@/shared/validators/common-validators";
import { AppointmentStatus } from "./appointment.types";

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be in HH:mm format");

export const createAppointmentSchema = z.object({
    patientId: objectIdSchema,
    doctorId: objectIdSchema,
    departmentId: objectIdSchema,
    date: dateSchema,
    startTime: timeSchema,
    endTime: timeSchema,
    purpose: z.string().optional(),
    notes: z.string().optional(),
});

export const updateAppointmentSchema = z.object({
    purpose: z.string().optional(),
    notes: z.string().optional(),
});

export const cancelAppointmentSchema = z.object({
    cancelReason: z.string().min(1, "Cancel reason is required"),
});

export const rescheduleAppointmentSchema = z.object({
    date: dateSchema,
    startTime: timeSchema,
    endTime: timeSchema,
});

export const searchAppointmentSchema = z.object({
    doctorId: objectIdSchema.optional(),
    departmentId: objectIdSchema.optional(),
    patientId: objectIdSchema.optional(),
    status: z.nativeEnum(AppointmentStatus).optional(),
    dateFrom: dateSchema.optional(),
    dateTo: dateSchema.optional(),
    limit: z.coerce.number().optional(),
    cursor: z.string().optional(),
});
