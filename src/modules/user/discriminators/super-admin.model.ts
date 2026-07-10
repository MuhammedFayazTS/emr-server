import mongoose from "mongoose";
import { User } from "@modules/user/user.model";
import { UserRole } from "@modules/user/user.types";

const superAdminSchema = new mongoose.Schema({
    // Super Admin has no extra fields beyond base — it's the root role
    permissions: {
        type: [String],
        default: ['*'], // full access; kept for future granular permission checks
    },
});

export const SuperAdmin = User.discriminator(UserRole.SUPER_ADMIN, superAdminSchema);