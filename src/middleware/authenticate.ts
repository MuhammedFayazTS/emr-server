import { NextFunction, Request, Response } from "express";

import UserRepository from "@/modules/user/user.repository";
import UserService from "@/modules/user/user.service";
import {
  AccessTokenPayload,
  accessTokenOptions,
  verifyJwtToken,
} from "@/shared/utils/jwt";
import { UnauthorizedException } from "@/shared/errors/AuthExceptions";

// Instantiate once when the module is loaded
const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      throw new UnauthorizedException("Authentication required");
    }

    const payload = verifyJwtToken<AccessTokenPayload>(accessToken, {
      secret: accessTokenOptions.secret,
    });

    const user = await userService.getUserDocumentById(payload.userId);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    if (!user.isActive) {
      throw new UnauthorizedException("Account is inactive");
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};