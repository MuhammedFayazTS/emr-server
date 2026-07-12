import { toUserResponseDto } from "@modules/user/user.mapper";
import { ReceptionistResponseDto } from "./receptionist.types";

export interface PaginatedReceptionistResponse {
    data: ReceptionistResponseDto[];
    pagination: {
        nextCursor: string | null;
        hasNextPage: boolean;
        limit: number;
    };
}

export function toReceptionistResponseDto(receptionist: any): ReceptionistResponseDto {
    return {
        ...toUserResponseDto(receptionist),
        assignedDesk: receptionist.assignedDesk,
    };
}

export function toPaginatedReceptionistResponse(data: any[], pagination: any): PaginatedReceptionistResponse {
    return {
        data: data.map(toReceptionistResponseDto),
        pagination: {
            nextCursor: pagination.nextCursor ?? null,
            hasNextPage: pagination.hasNextPage ?? false,
            limit: pagination.limit ?? 10,
        }
    };
}
