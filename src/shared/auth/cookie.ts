import { CookieOptions, Response } from "express";
import config from "@/config/index";
import { calculateExpirationDate, ONE_DAY_IN_MS } from "../utils/date";

type CookiePayloadType = {
    res: Response;
    accessToken: string;
    refreshToken: string;
};

export const AUTH_PATH = `${config.basePath}/auth`;

const defaults: CookieOptions = {
    httpOnly: true,
    secure: config.nodeEnv === "production" ? true : false,
    sameSite: config.nodeEnv === "production" ? "strict" : "lax",
};

export const getRefreshTokenCookieOptions = (): CookieOptions => {
    const expiresIn = config.jwt.refreshExpiresIn;
    const expires = calculateExpirationDate(expiresIn);
    return {
        ...defaults,
        expires,
        path: AUTH_PATH,
    };
};

export const getAccessTokenCookieOptions = (): CookieOptions => {
    const expiresIn = config.jwt.expiresIn;
    const expires = calculateExpirationDate(expiresIn);
    return {
        ...defaults,
        expires,
        path: "/",
    };
};

export const getSessionCookieOptions = (): CookieOptions => {
    return {
        ...defaults,
        maxAge: ONE_DAY_IN_MS,
    };
};

export const setAuthenticationCookies = (
    res: Response,
    accessToken: string,
    refreshToken: string
): void => {
    res.cookie(
        "accessToken",
        accessToken,
        getAccessTokenCookieOptions()
    );

    res.cookie(
        "refreshToken",
        refreshToken,
        getRefreshTokenCookieOptions()
    );
};

export const clearAuthenticationCookies = (
    res: Response
): void => {
    res.clearCookie("accessToken");

    res.clearCookie("refreshToken", {
        path: AUTH_PATH,
    });
};
