import ApiResponse from "./api-response";

import type { Response } from "express";
import type { ZodError } from "zod";

export const formatZodError = (res: Response, error: ZodError) => {
    const errors = error?.issues?.map((err) => ({
        field: err.path.join("."),
        message: err.message,
    }));

    return ApiResponse.badRequest(res, "Validation failed", errors);
};
