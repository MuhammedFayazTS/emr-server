import type AuditLogRepository from "./audit-log.repository";
import type {
    AuditLogQuery,
    CreateAuditLogInput,
    IAuditLog,
    LogChangeParams,
    PaginatedResult,
} from "./audit-log.types";
import type { Types } from "mongoose";

export function computeDiff(
    before?: Record<string, any> | null,
    after?: Record<string, any> | null,
): { before: Record<string, any> | null; after: Record<string, any> | null } {
    if (!before && !after) {
        return { before: null, after: null };
    }
    if (!before) {
        return { before: null, after: after ?? null };
    }
    if (!after) {
        return { before: before ?? null, after: null };
    }

    const diffBefore: Record<string, any> = {};
    const diffAfter: Record<string, any> = {};

    const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

    const ignoredKeys = new Set(["__v"]);

    for (const key of allKeys) {
        if (ignoredKeys.has(key)) continue;

        const valBefore = before[key];
        const valAfter = after[key];

        const strBefore = valBefore !== undefined ? JSON.stringify(valBefore) : undefined;
        const strAfter = valAfter !== undefined ? JSON.stringify(valAfter) : undefined;

        if (strBefore !== strAfter) {
            if (valBefore !== undefined) diffBefore[key] = valBefore;
            if (valAfter !== undefined) diffAfter[key] = valAfter;
        }
    }

    return {
        before: Object.keys(diffBefore).length > 0 ? diffBefore : null,
        after: Object.keys(diffAfter).length > 0 ? diffAfter : null,
    };
}

class AuditLogService {
    private auditLogRepository: AuditLogRepository;

    constructor(auditLogRepository: AuditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    async log(input: CreateAuditLogInput): Promise<void> {
        try {
            if (!input.actorType || !input.action || !input.entityType) {
                console.error("AuditLogService.log validation failed: required fields missing");
                return;
            }

            await this.auditLogRepository.create(input);
        } catch (err) {
            console.error("AuditLogService.log failed", err);
        }
    }

    async logChange(params: LogChangeParams): Promise<void> {
        const diff = computeDiff(params.before, params.after);
        return this.log({
            actorId: params.actorId ?? null,
            actorType: params.actorType,
            action: params.action,
            entityType: params.entityType,
            entityId: params.entityId,
            changes: { before: diff.before, after: diff.after },
            metadata: params.metadata,
        });
    }

    async find(query: AuditLogQuery): Promise<PaginatedResult<IAuditLog>> {
        return this.auditLogRepository.find(query);
    }

    async findByEntity(
        entityType: string,
        entityId: string | Types.ObjectId,
    ): Promise<IAuditLog[]> {
        return this.auditLogRepository.findByEntity(entityType, entityId);
    }
}

export default AuditLogService;
