import mongoose, { Schema } from "mongoose";
import { Gender, IPatient } from "./patient.types";

const addressSchema = new Schema(
    {
        line1: { type: String, required: true, trim: true },
        line2: { type: String, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        country: { type: String, default: "India", trim: true },
        pincode: { type: String, required: true, trim: true },
    },
    { _id: false }
);

const emergencyContactSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        relationship: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
    },
    { _id: false }
);

const patientSchema = new Schema<IPatient>(
    {
        patientId: {
            type: String,
            required: [true, "Patient ID is required"],
            unique: true,
        },
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
        },
        gender: {
            type: String,
            enum: Object.values(Gender),
            required: [true, "Gender is required"],
        },
        dateOfBirth: {
            type: Date,
            required: [true, "Date of birth is required"],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
        },
        bloodGroup: {
            type: String,
            trim: true,
        },
        address: {
            type: addressSchema,
        },
        emergencyContact: {
            type: emergencyContactSchema,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// ---- Indexes ----
patientSchema.index({ phone: 1 }, { unique: true });
patientSchema.index({ email: 1 }, { unique: true, sparse: true }); // unique only among docs that HAVE an email
patientSchema.index({ firstName: 1 });
patientSchema.index({ lastName: 1 });
patientSchema.index({ isActive: 1 });

export const Patient = mongoose.model<IPatient>("Patient", patientSchema);
