import UserRepository from "@/modules/user/user.repository";
import UserService from "@/modules/user/user.service";
import type { AccessTokenPayload } from "@/shared/auth/jwt";
import { accessTokenOptions, verifyJwtToken } from "@/shared/auth/jwt";
import { UnauthorizedError } from "@/shared/errors/AuthExceptions";

import type { NextFunction, Request, Response } from "express";

// Instantiate once when the module is loaded
const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export const authenticate = async (
    req: Request,
    _res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const accessToken = req.cookies?.accessToken;

        if (!accessToken) {
            throw new UnauthorizedError("Authentication required");
        }

        const payload = verifyJwtToken<AccessTokenPayload>(accessToken, {
            secret: accessTokenOptions.secret,
        });

        const user = await userService.getUserDocumentById(payload.userId);

        if (!user) {
            throw new UnauthorizedError("User not found");
        }

        if (!user.isActive) {
            throw new UnauthorizedError("Account is inactive");
        }

        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
};
