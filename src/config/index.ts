import { config as dotEnvConfig } from "dotenv"

dotEnvConfig()

import { getEnv } from "@/shared/utils/get-env"

const config = {
    port: getEnv("PORT", "5000"),

    cors: {
        origin: getEnv("CORS_ORIGIN", "*"),
        credentials: true
    },

    mongodb: {
        uri: getEnv("MONGODB_CONNECT_URI"),
    },

    jwt: {
        secret: getEnv("JWT_SECRET"),
        expiresIn: getEnv("JWT_EXPIRES_IN", "15m"),
        refreshSecret: getEnv("JWT_REFRESH_SECRET"),
        refreshExpiresIn: getEnv("JWT_REFRESH_EXPIRES_IN", "30d"),
    },

    basePath: getEnv("BASE_PATH", "/api/v1"),

    nodeEnv: getEnv("NODE_ENV", "development")
}

export default config