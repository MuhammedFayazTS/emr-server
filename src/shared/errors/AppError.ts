import type { HttpStatusCode } from "@/shared/constants/http-status-codes";
import { HTTP_STATUS_CODES } from "@/shared/constants/http-status-codes";

export class AppError extends Error {
    public statusCode: HttpStatusCode;
    //   public errorCode?: ErrorCode;

    constructor(
        message: string,
        statusCode: HttpStatusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        // errorCode?: ErrorCode
    ) {
        super(message);
        this.statusCode = statusCode;
        // this.errorCode = errorCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
