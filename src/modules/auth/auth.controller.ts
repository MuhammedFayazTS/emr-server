import { Request, Response } from "express";
import { AuthService } from "@/modules/auth/auth.service";
import ApiResponse from "@/shared/utils/api-response";

export class AuthController {
    constructor(private service: AuthService) { }

    register = async (_req: Request, res: Response) => {
        return ApiResponse.created(res, "User registered successfully", this.service.register());
    };
}