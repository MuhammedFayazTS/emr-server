import { asyncHandler } from "@/middleware/async-handler";
import type AuditLogService from "@/modules/audit-log/audit-log.service";
import { AuditAction } from "@/modules/audit-log/audit-log.types";
import type AuthService from "@/modules/auth/auth.service";
import { clearAuthenticationCookies, setAuthenticationCookies } from "@/shared/auth/cookie";
import ApiResponse from "@/shared/utils/api-response";

import { toUserResponseDto } from "../user/user.mapper";

import { loginSchema } from "./auth.validator";

import type { Request, Response } from "express";

class AuthController {
    private authService: AuthService;
    private auditLogService?: AuditLogService;

    constructor(authService: AuthService, auditLogService?: AuditLogService) {
        this.authService = authService;
        this.auditLogService = auditLogService;
    }

    public login = asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const userAgent = req.headers["user-agent"];
        const body = loginSchema.parse({
            ...req.body,
            userAgent,
        });

        const { user, accessToken, refreshToken } = await this.authService.login(body);

        setAuthenticationCookies(res, accessToken, refreshToken);

        await this.auditLogService?.log({
            actorId: user.id,
            actorType: "USER",
            action: AuditAction.LOGIN,
            entityType: "User",
            entityId: user.id,
            metadata: { ip: req.ip, userAgent: req.get("user-agent") },
            status: "SUCCESS",
            message: "User logged in successfully",
        });

        return ApiResponse.ok(res, "User login successfully", {
            user,
        });
    });

    public refreshToken = asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const refreshToken = req.cookies.refreshToken;

        const { accessToken, refreshToken: newRefreshToken } =
            await this.authService.refreshToken(refreshToken);

        setAuthenticationCookies(res, accessToken, newRefreshToken);

        return ApiResponse.ok(res, "Token refreshed successfully");
    });

    public getCurrentUser = asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const user = toUserResponseDto(req.user);
        return ApiResponse.ok(res, "User fetched successfully", user);
    });

    public logout = asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const refreshToken = req.cookies.refreshToken;
        await this.authService.logout(refreshToken);
        clearAuthenticationCookies(res);

        await this.auditLogService?.log({
            actorId: req.user?._id ?? null,
            actorType: req.user ? "USER" : "SYSTEM",
            action: AuditAction.LOGOUT,
            entityType: "User",
            entityId: req.user?._id ?? null,
            metadata: { ip: req.ip, userAgent: req.get("user-agent") },
            status: "SUCCESS",
            message: "User logged out successfully",
        });

        return ApiResponse.ok(res, "User logout successfully");
    });
}

export default AuthController;
