import { asyncHandler } from "@/middleware/async-handler";
import { BadRequestError } from "@/shared/errors/CommonExceptions";
import ApiResponse from "@/shared/utils/api-response";
import { paramsIdSchema } from "@/shared/validators/common-validators";

import { createPatientSchema, updatePatientSchema, searchPatientSchema } from "./patient.validator";

import type PatientService from "./patient.service";
import type { Request, Response } from "express";

class PatientController {
    private patientService: PatientService;

    constructor(patientService: PatientService) {
        this.patientService = patientService;
    }

    createPatient = asyncHandler(async (req: Request, res: Response) => {
        const body = createPatientSchema.parse(req.body);
        const createdBy = req.user!._id.toString();
        const patient = await this.patientService.createPatient(body, createdBy);
        return ApiResponse.created(res, "Patient created successfully", patient);
    });

    getPatientById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        const patient = await this.patientService.getPatientById(id);
        return ApiResponse.ok(res, "Patient fetched successfully", patient);
    });

    searchPatients = asyncHandler(async (req: Request, res: Response) => {
        const query = searchPatientSchema.parse(req.query);
        const result = await this.patientService.getPatients(query);
        return ApiResponse.ok(res, "Patients fetched successfully", result.data, result.pagination);
    });

    updatePatient = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        const body = updatePatientSchema.parse(req.body);
        const updatedBy = req.user!._id.toString();
        const patient = await this.patientService.updatePatient(id, body, updatedBy);
        return ApiResponse.ok(res, "Patient updated successfully", patient);
    });

    updatePatientStatus = asyncHandler(async (req: Request, res: Response) => {
        const { id } = paramsIdSchema.parse(req.params);
        const { isActive } = req.body;
        if (typeof isActive !== "boolean") throw new BadRequestError("Invalid status");
        const patient = await this.patientService.updatePatientStatus(id, isActive);
        return ApiResponse.ok(res, "Patient status updated successfully", patient);
    });
}

export default PatientController;
