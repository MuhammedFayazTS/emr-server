import { NotFoundError } from "@/shared/errors/CommonExceptions";
import DepartmentRepository from "./department.repository";
import { IDepartment } from "./department.types";
import { toDepartmentResponseDto, toPaginatedDepartmentResponse } from "./department.mapper";

class DepartmentService {
    private departmentRepository: DepartmentRepository;
    constructor(departmentRepository: DepartmentRepository) {
        this.departmentRepository = departmentRepository
    }

    async createDepartment(data: Partial<IDepartment>) {
        const department = await this.departmentRepository.createDepartment(data);
        return toDepartmentResponseDto(department);
    }

    async findByName(name: string) {
        const department = await this.departmentRepository.findByName(name);
        if (!department) return null;
        return toDepartmentResponseDto(department);
    }

    async findById(id: string) {
        const department = await this.departmentRepository.findById(id);
        if (!department) throw new NotFoundError("Department not found");
        return toDepartmentResponseDto(department);
    }

    async findAll(query: {
        limit?: number;
        cursor?: string;
        search?: string;
        isActive?: boolean;
    }) {
        const result = await this.departmentRepository.findAll(query);
        return toPaginatedDepartmentResponse(result.data, result.pagination);
    }

    async updateDepartment(id: string, data: Partial<IDepartment>) {
        const department = await this.departmentRepository.updateDepartment(id, data);

        if (!department) {
            throw new NotFoundError("Department not found");
        }

        return toDepartmentResponseDto(department);
    }

    async deleteDepartment(id: string) {
        const deleted = await this.departmentRepository.deleteDepartment(id);
        if(!deleted) throw new NotFoundError("Department not found");
        return toDepartmentResponseDto(deleted);
    }

    async restoreDepartment(id: string) {
        const restored = await this.departmentRepository.restoreDepartment(id);
        if(!restored) throw new NotFoundError("Department not found");
        return toDepartmentResponseDto(restored);
    }
}

export default DepartmentService