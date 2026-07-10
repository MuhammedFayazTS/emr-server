import { ErrorRequestHandler } from "express";
import { AppError } from "@/shared/errors/AppError";
import ApiResponse from "@/shared/utils/api-response";

export const errorHandler: ErrorRequestHandler = (
    error,
    req,
    res,
    next
): any => {
    console.error(`Error occurred on PATH ${req.path}`, error);
    
    if (error instanceof SyntaxError) {
        return ApiResponse.badRequest(
            res,
            "Invalid JSON format, please check your request body"
        );
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