import { toUserResponseDto } from "@modules/user/user.mapper";

import type { DoctorResponseDto } from "./doctor.types";

export interface PaginatedDoctorResponse {
    data: DoctorResponseDto[];
    pagination: {
        nextCursor: string | null;
        hasNextPage: boolean;
        limit: number;
    };
}

export function toDoctorResponseDto(doctor: any): DoctorResponseDto {
    return {
        ...toUserResponseDto(doctor),
        department: doctor.department,
        specialization: doctor.specialization,
        scheduleId: doctor.scheduleId,
        qualification: doctor.qualification,
    };
}

export function toPaginatedDoctorResponse(data: any[], pagination: any): PaginatedDoctorResponse {
    return {
        data: data.map(toDoctorResponseDto),
        pagination: {
            nextCursor: pagination.nextCursor ?? null,
            hasNextPage: pagination.hasNextPage ?? false,
            limit: pagination.limit ?? 10,
        },
    };
}
