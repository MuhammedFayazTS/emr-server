import { Request, Response } from "express";

import type AuditLogService from "@/modules/audit-log/audit-log.service";

import type UserService from "./user.service";

class UserController {
    private userService: UserService;
    private auditLogService?: AuditLogService;

    constructor(userService: UserService, auditLogService?: AuditLogService) {
        this.userService = userService;
        this.auditLogService = auditLogService;
    }
}

export default UserController;
