import rateLimit, { type Options } from "express-rate-limit";
import type { Request, Response } from "express";
import config from "@/config/index";
import ApiResponse from "@/shared/utils/api-response";
import { HTTP_STATUS_CODES } from "@/shared/constants/http-status-codes";

function createRateLimiter(options: Partial<Options> & { message: string }) {
    const { message, ...rateLimitOptions } = options;

    return rateLimit({
        windowMs: config.rateLimit.windowMs,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (_req: Request, res: Response) => {
            return ApiResponse.error(res, HTTP_STATUS_CODES.TOO_MANY_REQUESTS, message);
        },
        ...rateLimitOptions,
    });
}

export const apiRateLimiter = createRateLimiter({
    max: config.rateLimit.max,
    message: "Too many requests. Please try again later.",
});

export const authRateLimiter = createRateLimiter({
    windowMs: config.rateLimit.authWindowMs,
    max: config.rateLimit.authMax,
    message: "Too many authentication attempts. Please try again later.",
});
