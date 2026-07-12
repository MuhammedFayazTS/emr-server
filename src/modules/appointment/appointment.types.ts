import { Document, Types } from "mongoose";
import z from "zod";
import {
    createAppointmentSchema,
    updateAppointmentSchema,
    cancelAppointmentSchema,
    rescheduleAppointmentSchema,
    searchAppointmentSchema,
} from "./appointment.validator";

export enum AppointmentStatus {
    SCHEDULED = "SCHEDULED",
    ARRIVED = "ARRIVED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    NO_SHOW = "NO_SHOW",
}

export interface IAppointment {
    appointmentNumber: string;
    patientId: Types.ObjectId;
    doctorId: Types.ObjectId;
    departmentId: Types.ObjectId;
    date: Date;
    startTime: string; // "HH:mm"
    endTime: string;   // "HH:mm"
    status: AppointmentStatus;
    purpose?: string;
    notes?: string;
    cancelledAt?: Date;
    cancelledBy?: Types.ObjectId;
    cancelReason?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type AppointmentDocument = Document<Types.ObjectId, any, IAppointment> & IAppointment;

// ---- Input DTO ----
export type CreateAppointmentDto = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentDto = z.infer<typeof updateAppointmentSchema>;
export type CancelAppointmentDto = z.infer<typeof cancelAppointmentSchema>;
export type RescheduleAppointmentDto = z.infer<typeof rescheduleAppointmentSchema>;
export type SearchAppointmentQuery = z.infer<typeof searchAppointmentSchema>;

// ---- Output DTO ----
export interface AppointmentResponseDto {
    id: string;
    appointmentNumber: string;
    patientId: string | Record<string, any>;
    doctorId: string | Record<string, any>;
    departmentId: string | Record<string, any>;
    date: Date;
    startTime: string;
    endTime: string;
    status: AppointmentStatus;
    purpose?: string;
    notes?: string;
    cancelledAt?: Date;
    cancelledBy?: string;
    cancelReason?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
