import AuditLogController from "./audit-log.controller";
import AuditLogRepository from "./audit-log.repository";
import AuditLogService from "./audit-log.service";

const auditLogRepository = new AuditLogRepository();
const auditLogService = new AuditLogService(auditLogRepository);
const auditLogController = new AuditLogController(auditLogService);

export { auditLogRepository, auditLogService, auditLogController };
export * from "./audit-log.types";
