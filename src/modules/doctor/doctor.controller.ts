import { Request, Response } from "express";
import DoctorService from "./doctor.service";
import { asyncHandler } from "@/middleware/async-handler";
import ApiResponse from "@/shared/utils/api-response";
import { createDoctorSchema, updateDoctorSchema } from "./doctor.validator";
import { commonQuerySchema, paramsIdSchema } from "@/shared/validators/common-validators";

class DoctorController {
    private doctorService: DoctorService;
    constructor(doctorService: DoctorService) {
        this.doctorService = doctorService;
    }

    createDoctor = asyncHandler(async (req: Request, res: Response) => {
        const body = createDoctorSchema.parse(req.body)
        const doctor = await this.doctorService.createDoctor(body);
        return ApiResponse.created(res, "Doctor created successfully", doctor);
    })

    updateDoctor = asyncHandler(async (req: Request, res: Response) => {
        const body = updateDoctorSchema.parse(req.body)
        const { id } = paramsIdSchema.parse(req.params);
        const doctor = await this.doctorService.updateDoctor(id, body);
        return ApiResponse.ok(res, "Doctor updated successfully", doctor);
    })

    getAllDoctors = asyncHandler(async (req: Request, res: Response) => {
        const query = commonQuerySchema.parse(req.query);
        const result = await this.doctorService.getAllDoctors(query);
        return ApiResponse.ok(res, "Doctors fetched successfully", result.data, result.pagination);
    })

    getDoctorById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        const doctor = await this.doctorService.getDoctorById(id);
        return ApiResponse.ok(res, "Doctor fetched successfully", doctor);
    })

    deleteDoctor = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        await this.doctorService.deleteDoctor(id);
        return ApiResponse.ok(res, "Doctor deleted successfully");
    })
}

export default DoctorController;
