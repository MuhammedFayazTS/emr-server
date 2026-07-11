import { Document, Types, Model } from "mongoose";
import { SoftDeleteDocument, SoftDeleteModel } from "mongoose-delete";
import z from "zod";
import { createReceptionistSchema, createSuperAdminSchema } from "./user.validator";

export enum UserRole {
    SUPER_ADMIN = "super_admin",
    DOCTOR = "doctor",
    RECEPTIONIST = "receptionist"
}

export interface IRefreshToken {
    tokenId: string;
    tokenHash: string;
    expiresAt: Date;
    createdAt?: Date;
    userAgent?: string;
}

export interface IUser {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    role: UserRole;
    isActive: boolean;
    lastLoginAt?: Date;
    refreshTokens: IRefreshToken[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUserMethods {
    comparePassword(password: string): Promise<boolean>;
}

export interface IReceptionist {
    assignedDesk?: string;
}

export interface ISuperAdmin {
    permissions?: string[];
}

export type UserModelType = SoftDeleteModel<UserDocument, {}, IUserMethods>;
export type UserDocument = Document<Types.ObjectId, any, IUser> & IUser & IUserMethods & SoftDeleteDocument;

// ---- Input DTO ----
export type CreateReceptionistDto = z.infer<typeof createReceptionistSchema>;
export type CreateSuperAdminDto = z.infer<typeof createSuperAdminSchema>;

// ---- Output DTO ----
export interface UserResponseDto {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    isActive: boolean;
    createdAt?: Date;
}

export type ReceptionistResponseDto = UserResponseDto & IReceptionist;
export type SuperAdminResponseDto = UserResponseDto & ISuperAdmin;