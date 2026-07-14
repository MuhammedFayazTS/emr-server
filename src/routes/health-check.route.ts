import ApiResponse from "@/shared/utils/api-response";
import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
    return ApiResponse.ok(res, "Server is healthy!");
});

export default router;
