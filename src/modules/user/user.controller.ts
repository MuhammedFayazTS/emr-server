import { Request, Response } from "express";
import UserService from "./user.service";
import { asyncHandler } from "@/middleware/async-handler";
import ApiResponse from "@/shared/utils/api-response";
import { createDoctorSchema, updateDoctorSchema } from "./user.validator";
import { commonQuerySchema, paramsIdSchema } from "@/shared/validators/common-validators";

// TODO: seperate the doctor and receptionist module
class UserController {
    private userService: UserService;
    constructor(userService: UserService) {
        this.userService = userService;
    }

    // doctor
    createDoctor = asyncHandler(async (req: Request, res: Response) => {
        const body = createDoctorSchema.parse(req.body)
        const doctor = await this.userService.createDoctor(body);
        return ApiResponse.created(res, "Doctor created successfully", doctor);
    })

    updateDoctor = asyncHandler(async (req: Request, res: Response) => {
        const body = updateDoctorSchema.parse(req.body)
        const { id } = paramsIdSchema.parse(req.params);
        const doctor = await this.userService.updateDoctor(id, body);
        return ApiResponse.ok(res, "Doctor updated successfully", doctor);
    })

    getAllDoctors = asyncHandler(async (req: Request, res: Response) => {
        const query = commonQuerySchema.parse(req.query);
        const result = await this.userService.getAllDoctors(query);
        return ApiResponse.ok(res, "Doctors fetched successfully", result.data, result.pagination);
    })

    getDoctorById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        const doctor = await this.userService.getDoctorById(id);
        return ApiResponse.ok(res, "Doctor fetched successfully", doctor);
    })

    deleteDoctor = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        await this.userService.deleteDoctor(id);
        return ApiResponse.ok(res, "Doctor deleted successfully");
    })


}

export default UserController;