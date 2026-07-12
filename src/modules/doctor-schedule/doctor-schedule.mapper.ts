import { DoctorScheduleResponseDto } from "./doctor-schedule.types";

export interface PaginatedDoctorScheduleResponse {
    data: DoctorScheduleResponseDto[];
    pagination: {
        nextCursor: string | null;
        hasNextPage: boolean;
        limit: number;
    };
}

export function toDoctorScheduleResponseDto(schedule: any): DoctorScheduleResponseDto {
    return {
        id: schedule._id.toString(),
        doctorId: schedule.doctorId,
        isActive: schedule.isActive,
        slotDuration: schedule.slotDuration,
        workingDays: schedule.workingDays,
        createdAt: schedule.createdAt,
        updatedAt: schedule.updatedAt,
    };
}

export function toPaginatedDoctorScheduleResponse(data: any[], pagination: any): PaginatedDoctorScheduleResponse {
    return {
        data: data.map(toDoctorScheduleResponseDto),
        pagination: {
            nextCursor: pagination.nextCursor ?? null,
            hasNextPage: pagination.hasNextPage ?? false,
            limit: pagination.limit ?? 10,
        }
    };
}
