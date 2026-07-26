import z from "zod";

import { objectIdSchema, phoneSchema } from "@/shared/validators/common-validators";

export const genderEnum = z.enum(["Male", "Female", "Other"]);

export const bloodGroupEnum = z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]);

const addressSchema = z.object({
    line1: z.string().min(1, "Address line 1 is required"),
    line2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().default("India"),
    pincode: z.string().min(1, "Pincode is required"),
});

const emergencyContactSchema = z.object({
    name: z.string().min(1, "Emergency contact name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    phone: phoneSchema,
});

export const createPatientSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    gender: genderEnum,
    dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Date of birth must be a valid date",
    }),
    phone: phoneSchema,
    email: z.string().email("Invalid email format").optional(),
    bloodGroup: bloodGroupEnum.optional(),
    address: addressSchema.optional(),
    emergencyContact: emergencyContactSchema.optional(),
});

export const updatePatientSchema = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    phone: phoneSchema.optional(),
    email: z.string().email("Invalid email format").optional(),
    bloodGroup: bloodGroupEnum.optional(),
    address: addressSchema.optional(),
    emergencyContact: emergencyContactSchema.optional(),
});

export const searchPatientSchema = z.object({
    search: z.string().optional(),
    phone: z.string().optional(),
    patientId: z.string().optional(),
    limit: z.coerce.number().optional(),
    cursor: z.string().optional(),
    isActive: z.coerce.boolean().optional(),
});
