import { z } from "zod";

export const emailSchema = z.string().email("Invalid email format");

export const passwordSchema = z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must not exceed 128 characters");

export const emailValidator = {
    validator: (v: string) => emailSchema.safeParse(v).success,
    message: "Invalid email format"
};
