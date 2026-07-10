import { ErrorRequestHandler } from "express";
import { AppError } from "@/shared/errors/AppError";
import ApiResponse from "@/shared/utils/api-response";
import z from "zod";
import { formatZodError } from "@/shared/utils/zod";
import { HTTP_STATUS_CODES } from "@/shared/constants/http-status-codes";

export const errorHandler: ErrorRequestHandler = (
    error,
    req,
    res,
    next
): any => {
    console.error(`Error occurred on PATH ${req.path}`, error);

    if (error instanceof SyntaxError) {
        return ApiResponse.badRequest(res, "Invalid JSON format, please check your request body")
    }

    if (error instanceof z.ZodError) {
        return formatZodError(res, error);
    }

    if (error instanceof AppError) {
        return ApiResponse.error(res, error.statusCode, error.message);
    }

    return ApiResponse.internalServerError(
        res,
        "Internal Server Error",
        error?.message || "Unknown error occurred"
    );
};