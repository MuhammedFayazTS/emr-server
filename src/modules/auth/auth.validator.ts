import { emailSchema, passwordSchema } from "@/shared/validators/common-validators";
import { z } from "zod";

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    userAgent: z.string().optional(),
});

// TODO: change password, forget password