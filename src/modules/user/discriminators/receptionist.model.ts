import mongoose from "mongoose";
import { User } from "@modules/user/user.model";
import { UserRole } from "@modules/user/user.types";

const receptionistSchema = new mongoose.Schema({
    assignedDesk: {
        type: String,
        trim: true, // e.g. "Front Desk - OPD", optional operational detail
    },
});

export const Receptionist = User.discriminator(UserRole.RECEPTIONIST, receptionistSchema);