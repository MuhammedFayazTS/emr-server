import { HTTP_STATUS_CODES } from "../constants/http-status-codes";
import { AppError } from "./AppError";

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized Access") {
    super(
      message,
      HTTP_STATUS_CODES.UNAUTHORIZED,
    );
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(
      message,
      HTTP_STATUS_CODES.FORBIDDEN,
    );
  }
}