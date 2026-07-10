import { config as dotEnvConfig } from "dotenv"

dotEnvConfig()

const config = {
    port: process.env.PORT || 5000,

    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true
    },

    mongodb: {
        uri: process.env.MONGODB_CONNECT_URI,
    },
}

export default config