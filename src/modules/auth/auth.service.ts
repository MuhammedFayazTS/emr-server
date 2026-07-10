import { LoginDto } from "./auth.types";
import { UserService } from "../user";
import { NotFoundError } from "@/shared/errors/CommonExceptions";
import { toUserResponseDto } from "../user/user.mapper";
import { UnauthorizedException } from "@/shared/errors/AuthExceptions";
import { signAccessToken, signRefreshToken } from "@/shared/utils/jwt";
import { calculateExpirationDate } from "@/shared/utils/date";
import config from "@config/index";

export class AuthService {
  private userService: UserService
  constructor(userService: UserService) {
    this.userService = userService;
  }

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
}