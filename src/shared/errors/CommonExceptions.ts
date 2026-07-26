import { HTTP_STATUS_CODES } from "@/shared/constants/http-status-codes";

import { AppError } from "./AppError";

export class BadRequestError extends AppError {
    constructor(message = "Bad request") {
        super(message, HTTP_STATUS_CODES.BAD_REQUEST);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, HTTP_STATUS_CODES.NOT_FOUND);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Conflict") {
        super(message, HTTP_STATUS_CODES.CONFLICT);
    }
}

export class TooManyRequestsError extends AppError {
    constructor(message = "Too many requests") {
        super(message, HTTP_STATUS_CODES.TOO_MANY_REQUESTS);
    }
}
