import { Request, Response } from "express";
import AuthService from "@/modules/auth/auth.service";
import ApiResponse from "@/shared/utils/api-response";
import { clearAuthenticationCookies, setAuthenticationCookies } from "@/shared/auth/cookie";
import { asyncHandler } from "@/middleware/async-handler";
import { loginSchema } from "./auth.validator";
import { toUserResponseDto } from "../user/user.mapper";

class AuthController {
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

    public getCurrentUser = asyncHandler(
        async (req: Request, res: Response): Promise<any> => {
            const user = toUserResponseDto(req.user);
            return ApiResponse.ok(res, "User fetched successfully", user);
        }
    )

    public logout = asyncHandler(
        async (req: Request, res: Response): Promise<any> => {
            const refreshToken = req.cookies.refreshToken;
            await this.authService.logout(refreshToken);
            clearAuthenticationCookies(res)
            return ApiResponse.ok(res, "User logout successfully");
        }
    );
}

export default AuthController