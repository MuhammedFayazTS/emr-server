import { Document, Types, Model } from "mongoose";
import { SoftDeleteDocument, SoftDeleteModel } from "mongoose-delete";

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

export interface IDoctor {
    department: Types.ObjectId;
    specialization?: string;
    scheduleId?: Types.ObjectId;
    qualification?: string;
}

export interface IReceptionist {
    assignedDesk?: string;
}

export interface ISuperAdmin {
    permissions?: string[];
}

export type UserModelType = SoftDeleteModel<UserDocument, {}, IUserMethods>;
export type UserDocument = Document<Types.ObjectId, any, IUser> & IUser & IUserMethods & SoftDeleteDocument;

// DTOS
type CreateUserBaseDto = Pick<IUser, "name" | "email" | "phone"> & {
    password: string;
};

// ---- Input DTOs ----
export type CreateDoctorDto = CreateUserBaseDto & IDoctor;
export type CreateReceptionistDto = CreateUserBaseDto & IReceptionist;
export type CreateSuperAdminDto = CreateUserBaseDto & ISuperAdmin;

export type CreateUserDto = CreateDoctorDto | CreateReceptionistDto | CreateSuperAdminDto;

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

// Role-specific response variants, in case you ever need to expose
// department/specialization etc. back to the client (e.g. GET /doctors)
export type DoctorResponseDto = UserResponseDto & IDoctor;
export type ReceptionistResponseDto = UserResponseDto & IReceptionist;
export type SuperAdminResponseDto = UserResponseDto & ISuperAdmin;