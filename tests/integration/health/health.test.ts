import request from "supertest";
import app from "@/app";

describe("GET /api/v1/health-check", () => {
    it("should return a 200 status and OK status message", async () => {
        const res = await request(app).get("/api/v1/health-check");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ success: true, message: "Server is healthy!" });
    });
});
