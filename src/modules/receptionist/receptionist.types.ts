import type { createReceptionistSchema, updateReceptionistSchema } from "./receptionist.validator";
import type { UserResponseDto } from "@modules/user/user.types";
import type z from "zod";

export interface IReceptionist {
    assignedDesk?: string;
}

// ---- Input DTO ----
export type CreateReceptionistDto = z.infer<typeof createReceptionistSchema>;
export type UpdateReceptionistDto = z.infer<typeof updateReceptionistSchema>;

// ---- Output DTO ----
export type ReceptionistResponseDto = UserResponseDto & IReceptionist;
