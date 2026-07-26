import express from "express";

import { auditLogController } from "./index";

const router = express.Router();

router.get("/", auditLogController.getAuditLogs);
router.get("/entity/:entityType/:entityId", auditLogController.getEntityAuditLogs);

export default router;
