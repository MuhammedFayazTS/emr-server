import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import config from "@/config";

export type AccessTokenPayload = {
    userId: string;
    role: string;
};

export type RefreshTokenPayload = {
    userId: string;
    tokenId: string; // Unique identifier for this refresh token
};

type SignOptionsWithSecret = SignOptions & {
    secret: string;
};

const defaults: SignOptions = {
    audience: ["user"],
};

export const accessTokenOptions: SignOptionsWithSecret = {
    secret: config.jwt.secret,
    expiresIn: config.jwt.expiresIn as SignOptions["expiresIn"],
};

export const refreshTokenOptions: SignOptionsWithSecret = {
    secret: config.jwt.secret,
    expiresIn: config.jwt.refreshExpiresIn as SignOptions["expiresIn"],
};

/**
 * @description Sign a JWT token
 * @param payload - JWT payload
 * @param options - JWT options
 * @returns Signed JWT token
 */
export const signJwtToken = <T extends object>(
    payload: T,
    options: SignOptionsWithSecret
): string => {
    const { secret, ...signOptions } = options;

    return jwt.sign(payload, secret, {
        ...defaults,
        ...signOptions,
    });
};

/**
 * @description Sign an access token
 * @param payload - Access token payload
 * @returns Access token
 */
export const signAccessToken = (
    payload: AccessTokenPayload
): string => signJwtToken(payload, accessTokenOptions);

/**
 * @description Sign a refresh token
 * @param payload - Refresh token payload
 * @returns Refresh token
 */
export const signRefreshToken = (
    payload: RefreshTokenPayload
): string => signJwtToken(payload, refreshTokenOptions);


/**
 * @description Verify a JWT token
 * @param token - JWT token
 * @param options - JWT options
 * @returns Verified token payload
 */
export const verifyJwtToken = <T extends object>(
    token: string,
    options?: VerifyOptions & {
        secret?: string;
    }
): T => {
    const {
        secret = config.jwt.secret,
        ...verifyOptions
    } = options ?? {};

    const verifyOpts: VerifyOptions = {
        ...defaults,
        audience: defaults.audience as [string],
        ...verifyOptions,
    };

    return jwt.verify(token, secret, verifyOpts) as unknown as T;
};