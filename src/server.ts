import app from "./app"
import config from "@/config/index"

const startServer = async () => {
    try {
        app.listen(config.port, () => {
            console.log("SERVER started on :", config.port)
        })
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer()