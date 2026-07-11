import mongoose from "mongoose";
import { User } from "@modules/user/user.model";
import { UserRole } from "@modules/user/user.types";

const doctorSchema = new mongoose.Schema({
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: [true, 'Doctor must belong to a department'],
    },
    specialization: {
        type: String,
        trim: true,
    },
    // Reference to the doctor's schedule doc (working days, sessions, slot duration)
    scheduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DoctorSchedule',
    },
    qualification: {
        type: String,
        trim: true,
    },
});

doctorSchema.index({ department: 1 });

export const Doctor = User.discriminator(UserRole.DOCTOR, doctorSchema);
