import express from "express";
import cors from "cors"
import config from "@/config/index"
import ApiResponse from "./shared/utils/api-response";
import apiRoutes from "./routes";
import { errorHandler } from "@/middleware/error-handler";

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

// api routes
app.use("/api/v1", apiRoutes);

// health check route
app.get("/", (_req, res) => {
    return ApiResponse.ok(res, "Server is running!");
});

// error handler middleware
app.use(errorHandler);

export default app;