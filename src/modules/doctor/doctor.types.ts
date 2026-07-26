import type { createDoctorSchema, updateDoctorSchema } from "./doctor.validator";
import type { UserResponseDto } from "@modules/user/user.types";
import type { Types } from "mongoose";
import type z from "zod";

export interface IDoctor {
    department: Types.ObjectId;
    specialization?: string;
    scheduleId?: Types.ObjectId;
    qualification?: string;
}

// ---- Input DTO ----
export type CreateDoctorDto = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorDto = z.infer<typeof updateDoctorSchema>;

// ---- Output DTO ----
export type DoctorResponseDto = UserResponseDto & IDoctor;
