import { Document } from "mongoose";

import type { DayOfWeek } from "@/shared/constants/days";

import type {
    createDoctorScheduleSchema,
    updateDoctorScheduleSchema,
} from "./doctor-schedule.validator";
import type { Types } from "mongoose";
import type z from "zod";

export interface ISession {
    startTime: string; // "HH:mm" e.g. "09:00"
    endTime: string; // "HH:mm" e.g. "12:00"
    name: string;
}

export interface IWorkingDay {
    dayOfWeek: DayOfWeek;
    isWorking: boolean;
    sessions: ISession[];
}

export interface IDoctorSchedule {
    doctorId: Types.ObjectId;
    isActive: boolean;
    // timezone: string;
    slotDuration: number; // minutes (5, 10, 15, 20, 30, ...)
    workingDays: IWorkingDay[];
    createdAt?: Date;
    updatedAt?: Date;
}

// ---- Input DTO ----
export type CreateDoctorScheduleDto = z.infer<typeof createDoctorScheduleSchema>;
export type UpdateDoctorScheduleDto = z.infer<typeof updateDoctorScheduleSchema>;

// ---- Output DTO ----
export interface DoctorScheduleResponseDto {
    id: string;
    doctorId: string;
    isActive: boolean;
    slotDuration: number;
    workingDays: IWorkingDay[];
    createdAt?: Date;
    updatedAt?: Date;
}
