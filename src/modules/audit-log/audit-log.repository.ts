import { Types } from "mongoose";

import { AuditLog } from "./audit-log.model";

import type {
    AuditLogQuery,
    CreateAuditLogInput,
    IAuditLog,
    PaginatedResult,
} from "./audit-log.types";

class AuditLogRepository {
    async create(input: CreateAuditLogInput): Promise<IAuditLog> {
        const doc = {
            actorId: input.actorId ?? null,
            actorType: input.actorType,
            action: input.action,
            entityType: input.entityType,
            entityId: input.entityId ?? null,
            changes: input.changes ?? null,
            metadata: input.metadata ?? {},
            status: input.status ?? "SUCCESS",
            message: input.message ?? null,
            createdAt: new Date(),
        };
        return await AuditLog.create(doc);
    }

    async find(query: AuditLogQuery): Promise<PaginatedResult<IAuditLog>> {
        const filter: Record<string, any> = {};

        if (query.actorId && Types.ObjectId.isValid(query.actorId)) {
            filter.actorId = new Types.ObjectId(query.actorId);
        }
        if (query.entityType) {
            filter.entityType = query.entityType;
        }
        if (query.entityId) {
            filter.entityId = Types.ObjectId.isValid(query.entityId)
                ? new Types.ObjectId(query.entityId)
                : query.entityId;
        }
        if (query.action) {
            filter.action = query.action;
        }
        if (query.status) {
            filter.status = query.status;
        }
        if (query.dateFrom || query.dateTo) {
            filter.createdAt = {
                ...(query.dateFrom && { $gte: query.dateFrom }),
                ...(query.dateTo && { $lte: query.dateTo }),
            };
        }

        const page = query.page ?? 1;
        const limit = query.limit ?? 50;
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            AuditLog.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean<IAuditLog[]>(),
            AuditLog.countDocuments(filter),
        ]);

        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit) || 1,
        };
    }

    async findByEntity(
        entityType: string,
        entityId: string | Types.ObjectId,
    ): Promise<IAuditLog[]> {
        const id =
            typeof entityId === "string" && Types.ObjectId.isValid(entityId)
                ? new Types.ObjectId(entityId)
                : entityId;
        return await AuditLog.find({ entityType, entityId: id })
            .sort({ createdAt: -1 })
            .lean<IAuditLog[]>();
    }
}

export default AuditLogRepository;
