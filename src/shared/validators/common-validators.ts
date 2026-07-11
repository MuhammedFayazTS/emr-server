import { isValidPhoneNumber } from "libphonenumber-js";
import { ObjectId } from "mongoose";
import { z } from "zod";

export const emailSchema = z.email("Invalid email format");

export const phoneSchema = z.string().refine(
    (val) => isValidPhoneNumber(val),
    { message: "Invalid phone number format" }
);
export const passwordSchema = z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must not exceed 128 characters");

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Object ID format");

export const paramsIdSchema = z.object({
    id: objectIdSchema,
});

export const paramsDoctorIdSchema = z.object({
    doctorId: objectIdSchema,
});

export const dateSchema = z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine((val) => !isNaN(Date.parse(val)), { message: "Date must be a valid calendar date" });

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