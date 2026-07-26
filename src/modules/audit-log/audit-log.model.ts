import mongoose, { Schema, model } from "mongoose";

import { AuditAction } from "./audit-log.types";

import type { AuditLogModelType, IAuditLog } from "./audit-log.types";

const auditLogSchema = new Schema<IAuditLog, AuditLogModelType>(
    {
        actorId: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
        actorType: { type: String, enum: ["USER", "SYSTEM", "API_KEY"], required: true },
        action: { type: String, enum: Object.values(AuditAction), required: true, index: true },
        entityType: { type: String, required: true, index: true },
        entityId: { type: Schema.Types.Mixed, default: null, index: true },
        changes: {
            before: { type: Schema.Types.Mixed, default: null },
            after: { type: Schema.Types.Mixed, default: null },
        },
        metadata: {
            ip: { type: String, default: null },
            userAgent: { type: String, default: null },
            requestId: { type: String, default: null },
        },
        status: { type: String, enum: ["SUCCESS", "FAILURE"], default: "SUCCESS" },
        message: { type: String, default: null },
        createdAt: { type: Date, default: Date.now, index: true },
    },
    {
        collection: "audit_logs",
        timestamps: false,
        versionKey: false,
    },
);

auditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

auditLogSchema.set("toJSON", {
    transform(_doc, ret) {
        const { __v, ...safeObject } = ret;
        return safeObject;
    },
});

export const AuditLog =
    (mongoose.models.AuditLog as AuditLogModelType) ||
    model<IAuditLog, AuditLogModelType>("AuditLog", auditLogSchema);
