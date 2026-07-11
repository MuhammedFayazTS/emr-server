import z from "zod";
import { createReceptionistSchema, updateReceptionistSchema } from "./receptionist.validator";
import { UserResponseDto } from "@modules/user/user.types";

export interface IReceptionist {
    assignedDesk?: string;
}

// ---- Input DTO ----
export type CreateReceptionistDto = z.infer<typeof createReceptionistSchema>;
export type UpdateReceptionistDto = z.infer<typeof updateReceptionistSchema>;

// ---- Output DTO ----
export type ReceptionistResponseDto = UserResponseDto & IReceptionist;
