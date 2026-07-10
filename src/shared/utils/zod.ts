import { ZodError } from "zod";
import ApiResponse from "./api-response";
import { Response } from "express";

export const formatZodError = (res: Response, error: ZodError) => {
    const errors = error?.issues?.map((err) => ({
        field: err.path.join("."),
        message: err.message,
    }));

    return ApiResponse.badRequest(res, "Validation failed", errors);
};