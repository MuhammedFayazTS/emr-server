import z from "zod";

import { createUserSchema } from "@modules/user/user.validator";

export const createReceptionistSchema = createUserSchema.extend({
    // role: z.literal(UserRole.RECEPTIONIST),
    assignedDesk: z.string().optional(),
});

export const updateReceptionistSchema = createReceptionistSchema.partial();
