import { Types } from "mongoose";

import { NotFoundError } from "@/shared/errors/CommonExceptions";
import { ConflictError } from "@/shared/errors/CommonExceptions";

import { toDoctorScheduleResponseDto } from "./doctor-schedule.mapper";

import type DoctorScheduleRepository from "./doctor-schedule.repository";
import type {
    CreateDoctorScheduleDto,
    DoctorScheduleResponseDto,
    UpdateDoctorScheduleDto,
} from "./doctor-schedule.types";

class DoctorScheduleService {
    private repository: DoctorScheduleRepository;

    constructor(repository: DoctorScheduleRepository) {
        this.repository = repository;
    }

    async createSchedule(data: CreateDoctorScheduleDto): Promise<DoctorScheduleResponseDto> {
        // Check if a schedule already exists for this doctor (unique constraint)
        const existing = await this.repository.findByDoctorId(data.doctorId);
        if (existing) throw new ConflictError("A schedule already exists for this doctor");

        const schedule = await this.repository.create({
            ...data,
            doctorId: new Types.ObjectId(data.doctorId),
        });
        return toDoctorScheduleResponseDto(schedule);
    }

    async updateSchedule(
        id: string,
        data: UpdateDoctorScheduleDto,
    ): Promise<DoctorScheduleResponseDto> {
        const schedule = await this.repository.update(id, data);
        if (!schedule) throw new NotFoundError("Doctor schedule not found");
        return toDoctorScheduleResponseDto(schedule);
    }

    async getAllSchedules(query: { limit?: number; cursor?: string; isActive?: boolean }) {
        const result = await this.repository.findAll(query);
        return {
            data: result.data.map(toDoctorScheduleResponseDto),
            pagination: result.pagination,
        };
    }

    async getScheduleById(id: string): Promise<DoctorScheduleResponseDto> {
        const schedule = await this.repository.findById(id);
        if (!schedule) throw new NotFoundError("Doctor schedule not found");
        return toDoctorScheduleResponseDto(schedule);
    }

    async getScheduleByDoctorId(doctorId: string): Promise<DoctorScheduleResponseDto> {
        const schedule = await this.repository.findByDoctorId(doctorId);
        if (!schedule) throw new NotFoundError("Doctor schedule not found");
        return toDoctorScheduleResponseDto(schedule);
    }

    async deleteSchedule(id: string): Promise<DoctorScheduleResponseDto> {
        const schedule = await this.repository.delete(id);
        if (!schedule) throw new NotFoundError("Doctor schedule not found");
        return toDoctorScheduleResponseDto(schedule);
    }
}

export default DoctorScheduleService;
