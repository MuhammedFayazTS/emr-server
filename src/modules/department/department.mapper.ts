import { IDepartment } from "./department.types";

export interface DepartmentResponseDto {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface PaginatedDepartmentResponse {
    data: DepartmentResponseDto[];
    pagination: {
        nextCursor: string | null;
        hasNextPage: boolean;
        limit: number;
    };
}

export function toDepartmentResponseDto(department: any): DepartmentResponseDto {
    return {
        id: department._id ? department._id.toString() : department.id,
        name: department.name,
        description: department.description,
        isActive: department.isActive,
        createdAt: department.createdAt,
        updatedAt: department.updatedAt,
    };
}

export function toPaginatedDepartmentResponse(
    data: any[],
    pagination: any,
): PaginatedDepartmentResponse {
    return {
        data: data.map(toDepartmentResponseDto),
        pagination: {
            nextCursor: pagination.nextCursor ?? null,
            hasNextPage: pagination.hasNextPage ?? false,
            limit: pagination.limit ?? 10,
        },
    };
}
