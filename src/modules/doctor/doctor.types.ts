import { Types } from "mongoose";
import z from "zod";
import { createDoctorSchema, updateDoctorSchema } from "./doctor.validator";
import { UserResponseDto } from "@modules/user/user.types";

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
