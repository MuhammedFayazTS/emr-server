import mongoose, { Schema } from "mongoose";
import { AppointmentStatus, IAppointment } from "./appointment.types";

const appointmentSchema = new Schema<IAppointment>(
    {
        appointmentNumber: {
            type: String,
            required: [true, "Appointment number is required"],
        },

        patientId: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
            required: [true, "Patient ID is required"],
        },

        doctorId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Doctor ID is required"],
        },

        departmentId: {
            type: Schema.Types.ObjectId,
            ref: "Department",
            required: [true, "Department ID is required"],
        },

        date: {
            type: Date,
            required: [true, "Appointment date is required"],
        },

        startTime: {
            type: String,
            required: [true, "Start time is required"],
            match: [/^([01]\d|2[0-3]):[0-5]\d$/, "Start time must be in HH:mm format"],
        },

        endTime: {
            type: String,
            required: [true, "End time is required"],
            match: [/^([01]\d|2[0-3]):[0-5]\d$/, "End time must be in HH:mm format"],
        },

        status: {
            type: String,
            enum: Object.values(AppointmentStatus),
            default: AppointmentStatus.SCHEDULED,
        },

        purpose: {
            type: String,
            trim: true,
        },

        notes: {
            type: String,
            trim: true,
        },

        cancelledAt: {
            type: Date,
        },

        cancelledBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        cancelReason: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// ---------------- Indexes ----------------
appointmentSchema.index(
    { appointmentNumber: 1 },
    { unique: true }
);

// Prevent double booking of active appointments
appointmentSchema.index(
    {
        doctorId: 1,
        date: 1,
        startTime: 1,
        endTime: 1,
    },
    {
        unique: true,
        partialFilterExpression: {
            status: {
                $in: [
                    AppointmentStatus.SCHEDULED,
                    AppointmentStatus.ARRIVED,
                    AppointmentStatus.IN_PROGRESS,
                    AppointmentStatus.COMPLETED,
                ],
            },
        },
    }
);

appointmentSchema.index({
    patientId: 1,
});

appointmentSchema.index({
    departmentId: 1,
});

appointmentSchema.index({
    status: 1,
});

appointmentSchema.index({
    date: 1,
});

export const Appointment = mongoose.model<IAppointment>(
    "Appointment",
    appointmentSchema
);