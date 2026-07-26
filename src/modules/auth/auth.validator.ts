import { z } from "zod";

import { emailSchema, passwordSchema } from "@/shared/validators/common-validators";

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    userAgent: z.string().optional(),
});

// TODO: change password, forget password
