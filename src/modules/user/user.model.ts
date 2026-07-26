import mongoose, { Schema, model } from "mongoose";
import mongooseDelete from "mongoose-delete";

import { compareValue, hashValue } from "@/shared/auth/bcrypt";
import { emailValidator } from "@/shared/validators/common-validators";

import type { IUser, IUserMethods, UserModelType } from "./user.types";

const SALT_ROUNDS = 12;

export const baseOptions = {
    discriminatorKey: "role", // this field determines the sub-type
    collection: "users",
    timestamps: true,
};

const refreshTokenSchema = new Schema(
    {
        tokenId: {
            type: String,
            required: true,
        },
        tokenHash: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        userAgent: String,
    },
    {
        _id: false,
    },
);

const userSchema = new Schema<IUser, UserModelType, IUserMethods>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            maxlength: [100, "Name cannot exceed 100 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            trim: true,
            validate: emailValidator,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 8,
            select: false, // never returned by default in queries
        },
        phone: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true, // Super Admin can deactivate a doctor/receptionist
        },
        lastLoginAt: {
            type: Date,
        },
        // Refresh tokens are stored hashed, not plaintext, and support multi-device login
        refreshTokens: [refreshTokenSchema],
    },
    baseOptions,
);

// soft delete plugin
userSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: true,
});

// ---- Indexes ----
userSchema.index({ email: 1 }, { unique: true, partialFilterExpression: { deleted: false } });
userSchema.index({ role: 1, isActive: 1 }); // fast lookups like "all active doctors"

// ---- Hooks ----
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    if (this.password) {
        this.password = await hashValue(this.password, SALT_ROUNDS);
    }
});

// ---- Instance methods ----
userSchema.methods.comparePassword = async function (
    this: any,
    password: string,
): Promise<boolean> {
    if (!this.password) return false;
    return await compareValue(password, this.password);
};

// ---- toJSON configuration ----
userSchema.set("toJSON", {
    transform(_doc, ret) {
        const { password, refreshTokens, __v, ...safeObject } = ret;
        return safeObject;
    },
});

export const User =
    (mongoose.models.User as UserModelType) || model<IUser, UserModelType>("User", userSchema);
