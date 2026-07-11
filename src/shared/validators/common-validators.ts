import { z } from "zod";

export const emailSchema = z.string().email("Invalid email format");

export const passwordSchema = z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must not exceed 128 characters");

export const paramsIdSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
});

export const commonQuerySchema = z.object({
    limit: z.coerce.number().optional(),
    cursor: z.string().optional(),
    search: z.string().optional(),
    isActive: z.coerce.boolean().optional(),
})

export const emailValidator = {
    validator: (v: string) => emailSchema.safeParse(v).success,
    message: "Invalid email format"
};