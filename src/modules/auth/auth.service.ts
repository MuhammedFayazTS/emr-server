import { LoginDto } from "./auth.types";
import { UserService } from "../user";
import { NotFoundError } from "@/shared/errors/CommonExceptions";
import { toUserResponseDto } from "../user/user.mapper";
import { UnauthorizedException } from "@/shared/errors/AuthExceptions";
import { refreshTokenOptions, RefreshTokenPayload, signAccessToken, signRefreshToken, verifyJwtToken } from "@/shared/utils/jwt";
import { calculateExpirationDate } from "@/shared/utils/date";
import config from "@config/index";
import { compareValue } from "@/shared/utils/bcrypt";

export class AuthService {
  private userService: UserService
  constructor(userService: UserService) {
    this.userService = userService;
  }

  /**
   * Login
   * @param body LoginDto
   * @returns user, accessToken, refreshToken
   */
  async login(body: LoginDto) {
    const { email, password } = body
    const user = await this.userService.getUserByEmailWithPass(email)
    if (!user) throw new NotFoundError("User does not exist!");
    const isAuthenticated = await user.comparePassword(password)
    if (!isAuthenticated) throw new UnauthorizedException("Invalid Credentials!");
    if (!user.isActive) throw new UnauthorizedException("Account is Inactive!");

    const userResponse = toUserResponseDto(user)

    const tokenId = crypto.randomUUID();

    const accessToken = signAccessToken({
      userId: userResponse.id,
      role: user.role,
    });

    const refreshToken = signRefreshToken({
      userId: userResponse.id,
      tokenId,
    });

    await this.userService.saveRefreshToken(
      userResponse.id,
      tokenId,
      refreshToken,
      calculateExpirationDate(config.jwt.refreshExpiresIn),
      body.userAgent
    );

    return {
      user: userResponse,
      accessToken,
      refreshToken
    };
  }

  public async refreshToken(refreshToken: string) {
    // Verify JWT
    const payload = verifyJwtToken<RefreshTokenPayload>(
      refreshToken,
      {
        secret: refreshTokenOptions.secret,
      }
    );

    // Get user including refresh tokens
    const user = await this.userService.getUserWithRefreshToken(
      payload.userId,
      payload.tokenId
    );

    // TODO: 
    const storedToken = user?.refreshTokens[0];

    if (!user || !storedToken) {
      throw new UnauthorizedException(
        "Invalid refresh token"
      );
    }

    // Compare hash
    const isValid =
      await compareValue(
        refreshToken,
        storedToken.tokenHash
      );

    if (!isValid) {
      throw new UnauthorizedException(
        "Invalid refresh token"
      );
    }

    // Check expiry
    if (storedToken.expiresAt <= new Date()) {
      await this.userService.revokeRefreshToken(
        user.id,
        payload.tokenId
      );

      throw new UnauthorizedException(
        "Refresh token expired"
      );
    }

    // Rotate refresh token
    const newTokenId = crypto.randomUUID();

    const newRefreshToken =
      signRefreshToken({
        userId: user.id,
        tokenId: newTokenId,
      });

    const expiresAt = calculateExpirationDate(
      config.jwt.refreshExpiresIn
    );

    await this.userService.rotateRefreshToken(
      user.id,
      payload.tokenId,
      newTokenId,
      newRefreshToken,
      expiresAt,
      storedToken.userAgent
    );

    // Create new access token
    const accessToken =
      signAccessToken({
        userId: user.id,
        role: user.role,
      });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string) {
    // Verify JWT
    const payload = verifyJwtToken<RefreshTokenPayload>(
      refreshToken,
      {
        secret: refreshTokenOptions.secret,
      }
    );

    await this.userService.revokeRefreshToken(
      payload.userId,
      payload.tokenId
    );

    return
  }
}