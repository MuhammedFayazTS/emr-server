import { HTTP_STATUS_CODES } from "../constants/http-status-codes";
import { AppError } from "./AppError";

export class UnauthorizedException extends AppError {
  constructor(message = "Unauthorized Access") {
    super(
      message,
      HTTP_STATUS_CODES.UNAUTHORIZED,
    );
  }
}