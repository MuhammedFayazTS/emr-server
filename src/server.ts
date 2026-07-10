import app from "@/app"
import config from "@/config/index"
import DatabaseConfig from "@/config/db"

const startServer = async () => {
    try {
        await DatabaseConfig.connect()

        app.listen(config.port, () => {
            console.log("SERVER started on :", config.port)
        })
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer()