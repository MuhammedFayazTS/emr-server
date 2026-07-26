import { asyncHandler } from "@/middleware/async-handler";
import ApiResponse from "@/shared/utils/api-response";
import { commonQuerySchema, paramsIdSchema } from "@/shared/validators/common-validators";

import { createReceptionistSchema, updateReceptionistSchema } from "./receptionist.validator";

import type ReceptionistService from "./receptionist.service";
import type { Request, Response } from "express";

class ReceptionistController {
    private receptionistService: ReceptionistService;
    constructor(receptionistService: ReceptionistService) {
        this.receptionistService = receptionistService;
    }

    createReceptionist = asyncHandler(async (req: Request, res: Response) => {
        const body = createReceptionistSchema.parse(req.body);
        const receptionist = await this.receptionistService.createReceptionist(body);
        return ApiResponse.created(res, "Receptionist created successfully", receptionist);
    });

    updateReceptionist = asyncHandler(async (req: Request, res: Response) => {
        const body = updateReceptionistSchema.parse(req.body);
        const { id } = paramsIdSchema.parse(req.params);
        const receptionist = await this.receptionistService.updateReceptionist(id, body);
        return ApiResponse.ok(res, "Receptionist updated successfully", receptionist);
    });

    getAllReceptionists = asyncHandler(async (req: Request, res: Response) => {
        const query = commonQuerySchema.parse(req.query);
        const result = await this.receptionistService.getAllReceptionists(query);
        return ApiResponse.ok(
            res,
            "Receptionists fetched successfully",
            result.data,
            result.pagination,
        );
    });

    getReceptionistById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        const receptionist = await this.receptionistService.getReceptionistById(id);
        return ApiResponse.ok(res, "Receptionist fetched successfully", receptionist);
    });

    deleteReceptionist = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        await this.receptionistService.deleteReceptionist(id);
        return ApiResponse.ok(res, "Receptionist deleted successfully");
    });
}

export default ReceptionistController;
