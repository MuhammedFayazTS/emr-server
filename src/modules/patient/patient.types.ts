import { Types } from "mongoose";

import type {
    createPatientSchema,
    updatePatientSchema,
    searchPatientSchema,
} from "./patient.validator";
import type z from "zod";

export enum Gender {
    MALE = "Male",
    FEMALE = "Female",
    OTHER = "Other",
}

export interface IAddress {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
}

export interface IEmergencyContact {
    name: string;
    relationship: string;
    phone: string;
}

export interface IPatient {
    patientId: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    dateOfBirth: Date;
    phone: string;
    email?: string;
    bloodGroup?: string;
    address?: IAddress;
    emergencyContact?: IEmergencyContact;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// ---- Input DTO ----
export type CreatePatientDto = z.infer<typeof createPatientSchema>;
export type UpdatePatientDto = z.infer<typeof updatePatientSchema>;
export type SearchPatientQuery = z.infer<typeof searchPatientSchema>;

// ---- Output DTO ----
export interface PatientResponseDto {
    id: string;
    patientId: string;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: Date;
    phone: string;
    email?: string;
    bloodGroup?: string;
    address?: IAddress;
    emergencyContact?: IEmergencyContact;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
