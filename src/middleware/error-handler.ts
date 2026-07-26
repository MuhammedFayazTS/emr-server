import z from "zod";

import { HTTP_STATUS_CODES } from "@/shared/constants/http-status-codes";
import { AppError } from "@/shared/errors/AppError";
import ApiResponse from "@/shared/utils/api-response";
import { formatZodError } from "@/shared/utils/zod";

import type { ErrorRequestHandler } from "express";

interface MongoServerError extends Error {
    code: number;
    keyValue?: Record<string, unknown>;
}

const isMongoDuplicateKeyError = (error: unknown): error is MongoServerError => {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code: unknown }).code === 11000
    );
};

export const errorHandler: ErrorRequestHandler = (error, req, res, next): any => {
    console.error(`Error occurred on PATH ${req.path}`, error);

    if (error instanceof SyntaxError) {
        return ApiResponse.badRequest(res, "Invalid JSON format, please check your request body");
    }

    if (error instanceof z.ZodError) {
        return formatZodError(res, error);
    }

    if (isMongoDuplicateKeyError(error)) {
        const field = error.keyValue ? Object.keys(error.keyValue)[0] : "field";
        const value = error.keyValue?.[field];
        return ApiResponse.error(
            res,
            HTTP_STATUS_CODES.CONFLICT,
            `${field} '${value}' already exists`,
        );
    }

    if (error instanceof AppError) {
        return ApiResponse.error(res, error.statusCode, error.message);
    }

    return ApiResponse.internalServerError(
        res,
        "Internal Server Error",
        error?.message || "Unknown error occurred",
    );
};
