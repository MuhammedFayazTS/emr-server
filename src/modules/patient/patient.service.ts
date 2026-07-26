import { Types } from "mongoose";

import { BadRequestError, ConflictError, NotFoundError } from "@/shared/errors/CommonExceptions";

import { toPatientResponseDto } from "./patient.mapper";

import type PatientRepository from "./patient.repository";
import type {
    CreatePatientDto,
    Gender,
    PatientResponseDto,
    SearchPatientQuery,
    UpdatePatientDto,
} from "./patient.types";

class PatientService {
    private repository: PatientRepository;

    constructor(repository: PatientRepository) {
        this.repository = repository;
    }

    async createPatient(data: CreatePatientDto, createdBy?: string): Promise<PatientResponseDto> {
        // Check phone uniqueness
        const phoneExists = await this.repository.existsByPhone(data.phone);
        if (phoneExists) throw new ConflictError("A patient with this phone number already exists");

        // Check email uniqueness (if provided)
        if (data.email) {
            const emailExists = await this.repository.existsByEmail(data.email);
            if (emailExists) throw new ConflictError("A patient with this email already exists");
        }

        // Generate patient ID
        const patientId = await this.generatePatientId();

        // Save
        // TODO: add last created user id
        const patient = await this.repository.create({
            ...data,
            gender: data.gender as Gender,
            patientId,
            dateOfBirth: new Date(data.dateOfBirth),
            // createdBy: createdBy ? new Types.ObjectId(createdBy) : undefined,
        });

        // TODO: AuditService.log("patient:create", { patientId, createdBy })

        return toPatientResponseDto(patient);
    }

    async updatePatient(
        id: string,
        data: UpdatePatientDto,
        updatedBy?: string,
    ): Promise<PatientResponseDto> {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundError("Patient not found");

        // Check phone uniqueness if changing
        if (data.phone && data.phone !== existing.phone) {
            const phoneExists = await this.repository.existsByPhone(data.phone);
            if (phoneExists)
                throw new ConflictError("A patient with this phone number already exists");
        }

        // Check email uniqueness if changing
        if (data.email && data.email !== existing.email) {
            const emailExists = await this.repository.existsByEmail(data.email);
            if (emailExists) throw new ConflictError("A patient with this email already exists");
        }

        // TODO: add last updated user id
        const patient = await this.repository.update(id, {
            ...data,
            // updatedBy: updatedBy ? new Types.ObjectId(updatedBy) : undefined,
        });
        if (!patient) throw new NotFoundError("Patient not found");

        return toPatientResponseDto(patient);
    }

    async updatePatientStatus(id: string, isActive: boolean): Promise<PatientResponseDto> {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundError("Patient not found");

        if (!existing.isActive && isActive === false) {
            throw new BadRequestError("Patient is already inactive");
        }

        const patient = await this.repository.update(id, { isActive });
        if (!patient) throw new NotFoundError("Patient not found");

        // TODO: AuditService.log("patient:deactivate", { patientId: existing.patientId })

        return toPatientResponseDto(patient);
    }

    async getPatientById(id: string): Promise<PatientResponseDto> {
        const patient = await this.repository.findById(id);
        if (!patient) throw new NotFoundError("Patient not found");
        return toPatientResponseDto(patient);
    }

    async getPatients(query: SearchPatientQuery) {
        const result = await this.repository.findAll(query);
        return {
            data: result.data.map(toPatientResponseDto),
            pagination: result.pagination,
        };
    }

    private async generatePatientId(): Promise<string> {
        const seq = await this.repository.getNextSequence();
        return `PAT${String(seq).padStart(6, "0")}`;
    }
}

export default PatientService;
