import { Request, Response } from "express";
import { AuthService } from "@/modules/auth/auth.service";
import ApiResponse from "@/shared/utils/api-response";
import { setAuthenticationCookies } from "@/shared/utils/cookie";
import { asyncHandler } from "@/middleware/async-handler";
import { loginSchema } from "./auth.validator";

export class AuthController {
    private authService: AuthService
    constructor(authService: AuthService) {
        this.authService = authService
    }

    public login = asyncHandler(
        async (req: Request, res: Response): Promise<any> => {
            const userAgent = req.headers["user-agent"];
            const body = loginSchema.parse({
                ...req.body,
                userAgent,
            });

            const { user, accessToken, refreshToken } =
                await this.authService.login(body);

            setAuthenticationCookies(
                res,
                accessToken,
                refreshToken
            );

            return ApiResponse.ok(
                res,
                "User login successfully",
                {
                    user,
                }
            );
        }
    );

    public refreshToken = asyncHandler(
        async (req: Request, res: Response): Promise<any> => {
            const refreshToken = req.cookies.refreshToken;

            const { accessToken, refreshToken: newRefreshToken } =
                await this.authService.refreshToken(refreshToken);

            setAuthenticationCookies(
                res,
                accessToken,
                newRefreshToken
            );

            return ApiResponse.ok(
                res,
                "Token refreshed successfully"
            );
        }
    );
}