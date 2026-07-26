import z from "zod";

import { AuditAction } from "./audit-log.types";

export const auditLogQuerySchema = z.object({
    actorId: z.string().optional(),
    entityType: z.string().optional(),
    entityId: z.string().optional(),
    action: z.nativeEnum(AuditAction).optional(),
    status: z.enum(["SUCCESS", "FAILURE"]).optional(),
    dateFrom: z
        .string()
        .datetime()
        .optional()
        .transform((val) => (val ? new Date(val) : undefined)),
    dateTo: z
        .string()
        .datetime()
        .optional()
        .transform((val) => (val ? new Date(val) : undefined)),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(50),
});
