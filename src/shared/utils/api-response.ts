import type { HttpStatusCode } from "@/shared/constants/http-status-codes";
import { HTTP_STATUS_CODES } from "@/shared/constants/http-status-codes";

import type { Response } from "express";

export type Meta = {
    page?: number;
    limit?: number;
    totalItems?: number;
    totalPages?: number;
    [key: string]: any;
};

export class ApiResponse {
    static success(
        res: Response,
        statusCode: HttpStatusCode = HTTP_STATUS_CODES.OK,
        message = "Success",
        data: unknown = null,
        meta?: Meta,
    ) {
        return res.status(statusCode).json({
            success: true,
            message,
            ...(data !== null && { data }),
            ...(meta !== undefined && { meta }),
        });
    }

    static error(
        res: Response,
        statusCode: HttpStatusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        message = "Internal server error",
        data: unknown = null,
        meta: unknown = null,
    ) {
        return res.status(statusCode).json({
            success: false,
            message,
            ...(data !== null && { data }),
            ...(meta !== null && { meta }),
        });
    }

    // Common Success Responses
    static ok(res: Response, message = "Success", data: unknown = null, meta?: Meta) {
        return this.success(res, HTTP_STATUS_CODES.OK, message, data, meta);
    }

    static created(
        res: Response,
        message = "Created successfully",
        data: unknown = null,
        meta?: Meta,
    ) {
        return this.success(res, HTTP_STATUS_CODES.CREATED, message, data, meta);
    }

    static noContent(res: Response) {
        return res.status(HTTP_STATUS_CODES.NO_CONTENT).send();
    }

    // Common Client Error Responses
    static badRequest(
        res: Response,
        message = "Bad request",
        data: unknown = null,
        meta: unknown = null,
    ) {
        return this.error(res, HTTP_STATUS_CODES.BAD_REQUEST, message, data, meta);
    }

    static unauthorized(
        res: Response,
        message = "Unauthorized",
        data: unknown = null,
        meta: unknown = null,
    ) {
        return this.error(res, HTTP_STATUS_CODES.UNAUTHORIZED, message, data, meta);
    }

    static forbidden(
        res: Response,
        message = "Forbidden",
        data: unknown = null,
        meta: unknown = null,
    ) {
        return this.error(res, HTTP_STATUS_CODES.FORBIDDEN, message, data, meta);
    }

    static notFound(
        res: Response,
        message = "Not found",
        data: unknown = null,
        meta: unknown = null,
    ) {
        return this.error(res, HTTP_STATUS_CODES.NOT_FOUND, message, data, meta);
    }

    static conflict(
        res: Response,
        message = "Conflict",
        data: unknown = null,
        meta: unknown = null,
    ) {
        return this.error(res, HTTP_STATUS_CODES.CONFLICT, message, data, meta);
    }

    static unprocessableEntity(
        res: Response,
        message = "Unprocessable entity",
        data: unknown = null,
        meta: unknown = null,
    ) {
        return this.error(res, HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY, message, data, meta);
    }

    static tooManyRequests(
        res: Response,
        message = "Too many requests",
        data: unknown = null,
        meta: unknown = null,
    ) {
        return this.error(res, HTTP_STATUS_CODES.TOO_MANY_REQUESTS, message, data, meta);
    }

    // Common Server Error Responses
    static internalServerError(
        res: Response,
        message = "Internal server error",
        data: unknown = null,
        meta: unknown = null,
    ) {
        return this.error(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, message, data, meta);
    }
}

export default ApiResponse;
