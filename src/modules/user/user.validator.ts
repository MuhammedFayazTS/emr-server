import z from "zod";

import {
    emailSchema,
    objectIdSchema,
    passwordSchema,
    phoneSchema,
} from "@/shared/validators/common-validators";

export const createUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: emailSchema,
    password: passwordSchema,
    phone: phoneSchema,
    // role: z.enum([UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST]),
});

export const createReceptionistSchema = createUserSchema.extend({
    // role: z.literal(UserRole.RECEPTIONIST),
    assignedDesk: z.string().optional(),
});

export const createSuperAdminSchema = createUserSchema.extend({
    // role: z.literal(UserRole.SUPER_ADMIN),
    permissions: z.array(z.string()).optional(),
});
