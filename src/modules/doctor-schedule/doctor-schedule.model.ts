import mongoose, { Schema } from "mongoose";
import { DayOfWeek, IDoctorSchedule } from "./doctor-schedule.types";

const sessionSchema = new Schema(
    {
        startTime: {
            type: String,
            required: [true, "Session start time is required"],
            match: [/^([01]\d|2[0-3]):[0-5]\d$/, "Start time must be in HH:mm format"],
        },
        endTime: {
            type: String,
            required: [true, "Session end time is required"],
            match: [/^([01]\d|2[0-3]):[0-5]\d$/, "End time must be in HH:mm format"],
        },
    },
    { _id: false }
);

const workingDaySchema = new Schema(
    {
        dayOfWeek: {
            type: String,
            enum: Object.values(DayOfWeek),
            required: [true, "Day of week is required"],
        },
        isWorking: {
            type: Boolean,
            default: false,
        },
        sessions: {
            type: [sessionSchema],
            default: [],
        },
    },
    { _id: false }
);

const doctorScheduleSchema = new Schema(
    {
        doctorId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Doctor ID is required"],
            unique: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        // timezone: {
        //     type: String,
        //     default: "Asia/Kolkata",
        // },
        slotDuration: {
            type: Number,
            required: [true, "Slot duration is required"],
        },
        workingDays: {
            type: [workingDaySchema],
            default: [],
        },
    },
    { timestamps: true }
);

export const DoctorSchedule = mongoose.model<IDoctorSchedule>("DoctorSchedule", doctorScheduleSchema);
