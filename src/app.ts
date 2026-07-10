import express from "express";
import cors from "cors"
import config from "@/config/index"

const app = express();

app.use(cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

// body parsing
app.use(express.json({ limit: "10mb" }))
// url parsing
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// health check route
app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
    });
});

export default app;