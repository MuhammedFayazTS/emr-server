import z from "zod";

import { asyncHandler } from "@/middleware/async-handler";
import ApiResponse from "@/shared/utils/api-response";
import { commonQuerySchema, paramsIdSchema } from "@/shared/validators/common-validators";

import { createDepartmentSchema } from "./department.validator";

import type DepartmentService from "./department.service";
import type { Request, Response } from "express";

class DepartmentController {
    private departmentService: DepartmentService;
    constructor(departmentService: DepartmentService) {
        this.departmentService = departmentService;
    }

    public createDepartment = asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const body = createDepartmentSchema.parse(req.body);
        const department = await this.departmentService.createDepartment(body);
        return ApiResponse.created(res, "Department created successfully", department);
    });

    public getDepartment = asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const { id } = paramsIdSchema.parse(req.params);
        const department = await this.departmentService.findById(id);
        return ApiResponse.ok(res, "Department fetched successfully", department);
    });

    public getAllDepartments = asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const query = commonQuerySchema.parse(req.query);
        const departments = await this.departmentService.findAll(query);
        return ApiResponse.ok(
            res,
            "Departments fetched successfully",
            departments.data,
            departments.pagination,
        );
    });

    public updateDepartment = asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const { id } = paramsIdSchema.parse(req.params);
        const department = await this.departmentService.updateDepartment(id, req.body);
        return ApiResponse.ok(res, "Department updated successfully", department);
    });

    public updateDepartmentStatus = asyncHandler(
        async (req: Request, res: Response): Promise<any> => {
            const { id } = paramsIdSchema.parse(req.params);
            const { isActive } = z.object({ isActive: z.boolean() }).parse(req.body);
            const department = await this.departmentService.updateDepartment(id, { isActive });
            return ApiResponse.ok(res, "Department status updated successfully", department);
        },
    );

    public deleteDepartment = asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const { id } = paramsIdSchema.parse(req.params);
        const department = await this.departmentService.deleteDepartment(id);
        return ApiResponse.ok(res, "Department deleted successfully", department);
    });

    public restoreDepartment = asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const { id } = paramsIdSchema.parse(req.params);
        const department = await this.departmentService.restoreDepartment(id);
        return ApiResponse.ok(res, "Department restored successfully", department);
    });
}

export default DepartmentController;
