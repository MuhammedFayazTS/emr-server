import { Request, Response } from "express";
import DoctorScheduleService from "./doctor-schedule.service";
import { asyncHandler } from "@/middleware/async-handler";
import ApiResponse from "@/shared/utils/api-response";
import { createDoctorScheduleSchema, updateDoctorScheduleSchema } from "./doctor-schedule.validator";
import { commonQuerySchema, paramsIdSchema, objectIdSchema } from "@/shared/validators/common-validators";

class DoctorScheduleController {
    private scheduleService: DoctorScheduleService;

    constructor(scheduleService: DoctorScheduleService) {
        this.scheduleService = scheduleService;
    }

    createSchedule = asyncHandler(async (req: Request, res: Response) => {
        const body = createDoctorScheduleSchema.parse(req.body);
        const schedule = await this.scheduleService.createSchedule(body);
        return ApiResponse.created(res, "Doctor schedule created successfully", schedule);
    })

    updateSchedule = asyncHandler(async (req: Request, res: Response) => {
        const body = updateDoctorScheduleSchema.parse(req.body);
        const { id } = paramsIdSchema.parse(req.params);
        const schedule = await this.scheduleService.updateSchedule(id, body);
        return ApiResponse.ok(res, "Doctor schedule updated successfully", schedule);
    })

    getAllSchedules = asyncHandler(async (req: Request, res: Response) => {
        const query = commonQuerySchema.parse(req.query);
        const result = await this.scheduleService.getAllSchedules(query);
        return ApiResponse.ok(res, "Doctor schedules fetched successfully", result.data, result.pagination);
    })

    getScheduleById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        const schedule = await this.scheduleService.getScheduleById(id);
        return ApiResponse.ok(res, "Doctor schedule fetched successfully", schedule);
    })

    getScheduleByDoctorId = asyncHandler(async (req: Request, res: Response) => {
        const doctorId = objectIdSchema.parse(req.params.doctorId);
        const schedule = await this.scheduleService.getScheduleByDoctorId(doctorId);
        return ApiResponse.ok(res, "Doctor schedule fetched successfully", schedule);
    })

    deleteSchedule = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        await this.scheduleService.deleteSchedule(id);
        return ApiResponse.ok(res, "Doctor schedule deleted successfully");
    })
}

export default DoctorScheduleController;
