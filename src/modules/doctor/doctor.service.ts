import { Types } from "mongoose";

import { NotFoundError } from "@/shared/errors/CommonExceptions";
import { UserRole } from "@modules/user/user.types";

import { toDoctorResponseDto } from "./doctor.mapper";

import type DoctorRepository from "./doctor.repository";
import type { CreateDoctorDto, DoctorResponseDto, UpdateDoctorDto } from "./doctor.types";

class DoctorService {
    private repository: DoctorRepository;

    constructor(repository: DoctorRepository) {
        this.repository = repository;
    }

    async createDoctor(data: CreateDoctorDto): Promise<DoctorResponseDto> {
        const doctor = await this.repository.createDoctor({
            ...data,
            role: UserRole.DOCTOR,
            department: new Types.ObjectId(data.department),
            scheduleId: data.scheduleId ? new Types.ObjectId(data.scheduleId) : undefined,
        });
        return toDoctorResponseDto(doctor);
    }

    async updateDoctor(id: string, data: UpdateDoctorDto): Promise<DoctorResponseDto> {
        const doctor = await this.repository.updateDoctor(id, {
            ...data,
            department: new Types.ObjectId(data.department),
            scheduleId: data.scheduleId ? new Types.ObjectId(data.scheduleId) : undefined,
        });
        if (!doctor) throw new NotFoundError("Doctor not found");
        return toDoctorResponseDto(doctor);
    }

    async getAllDoctors(query: {
        limit?: number;
        cursor?: string;
        search?: string;
        isActive?: boolean;
    }) {
        const result = await this.repository.findAllDoctors(query);
        return {
            data: result.data.map(toDoctorResponseDto),
            pagination: result.pagination,
        };
    }

    async getDoctorById(id: string): Promise<DoctorResponseDto> {
        const doctor = await this.repository.findDoctorById(id);
        if (!doctor) throw new NotFoundError("Doctor not found");
        return toDoctorResponseDto(doctor);
    }

    async deleteDoctor(id: string): Promise<DoctorResponseDto> {
        const doctor = await this.repository.deleteDoctor(id);
        if (!doctor) throw new NotFoundError("Doctor not found");
        return toDoctorResponseDto(doctor);
    }
}

export default DoctorService;
