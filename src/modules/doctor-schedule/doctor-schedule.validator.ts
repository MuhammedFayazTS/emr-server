import z from "zod";
import { objectIdSchema } from "@/shared/validators/common-validators";
import { DayOfWeek } from "@/shared/constants/days";

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be in HH:mm format");

const sessionSchema = z.object({
    startTime: timeSchema,
    endTime: timeSchema,
    name: z.string().min(1, "Session name cannot be empty"),
}).refine(
    (data) => data.startTime < data.endTime,
    { message: "Start time must be before end time" }
);

const workingDaySchema = z.object({
    dayOfWeek: z.enum(DayOfWeek),
    isWorking: z.boolean(),
    sessions: z.array(sessionSchema).default([]),
});

export const createDoctorScheduleSchema = z.object({
    doctorId: objectIdSchema,
    isActive: z.boolean().optional().default(true),
    slotDuration: z.number().int().positive("Slot duration must be positive"),
    workingDays: z.array(workingDaySchema).default([]),
});

export const updateDoctorScheduleSchema = createDoctorScheduleSchema
    .omit({ doctorId: true })
    .partial();
