import type { Document, Model, Types } from "mongoose";

export enum AuditAction {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    ACCESS_DENIED = "ACCESS_DENIED",
}

export type ActorType = "USER" | "SYSTEM" | "API_KEY";
export type AuditStatus = "SUCCESS" | "FAILURE";

export interface IAuditLog {
    _id: Types.ObjectId;
    actorId: Types.ObjectId | null;
    actorType: ActorType;
    action: AuditAction;
    entityType: string;
    entityId: Types.ObjectId | string | null;
    changes: {
        before: Record<string, any> | null;
        after: Record<string, any> | null;
    } | null;
    metadata: {
        ip: string | null;
        userAgent: string | null;
        requestId: string | null;
        [key: string]: any;
    };
    status: AuditStatus;
    message: string | null;
    createdAt: Date;
}

export type AuditLogDocument = IAuditLog & Document;
export type AuditLogModelType = Model<AuditLogDocument>;

export interface CreateAuditLogInput {
    actorId?: Types.ObjectId | string | null;
    actorType: ActorType;
    action: AuditAction;
    entityType: string;
    entityId?: Types.ObjectId | string | null;
    changes?: { before?: Record<string, any> | null; after?: Record<string, any> | null } | null;
    metadata?: {
        ip?: string | null;
        userAgent?: string | null;
        requestId?: string | null;
        [key: string]: any;
    };
    status?: AuditStatus;
    message?: string | null;
}

export interface AuditLogQuery {
    actorId?: string;
    entityType?: string;
    entityId?: string;
    action?: AuditAction;
    status?: AuditStatus;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
}

export interface LogChangeParams {
    actorId?: Types.ObjectId | string | null;
    actorType: ActorType;
    action: AuditAction.CREATE | AuditAction.UPDATE | AuditAction.DELETE;
    entityType: string;
    entityId: Types.ObjectId | string;
    before?: Record<string, any> | null;
    after?: Record<string, any> | null;
    metadata?: Record<string, any>;
}
