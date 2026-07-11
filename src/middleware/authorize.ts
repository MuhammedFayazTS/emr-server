import { NextFunction, Request, Response } from "express";

import permissionService from "@/shared/auth/permission.service";
import { Permission } from "@constants/permissions";
import { ForbiddenError } from "@/shared/errors/AuthExceptions";
import { UnauthorizedError } from "@/shared/errors/AuthExceptions";

export const authorize =
    (...permissions: Permission[]) =>
        (req: Request, _res: Response, next: NextFunction): void => {
            try {
                const user = req.user;

                if (!user) {
                    throw new UnauthorizedError("Authentication required");
                }

                const allowed = permissionService.hasAllPermissions(
                    user.role,
                    permissions
                );

                if (!allowed) {
                    throw new ForbiddenError(
                        "You do not have permission to perform this action."
                    );
                }

                next();
            } catch (error) {
                next(error);
            }
        };