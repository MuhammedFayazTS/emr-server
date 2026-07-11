import { NotFoundError } from "@/shared/errors/CommonExceptions";
import DepartmentRepository from "./department.repository";
import { IDepartment } from "./department.types";

class DepartmentService {
    private departmentRepository: DepartmentRepository;
    constructor(departmentRepository: DepartmentRepository) {
        this.departmentRepository = departmentRepository
    }

    async createDepartment(data: Partial<IDepartment>) {
        return await this.departmentRepository.createDepartment(data);
    }

    async findByName(name: string) {
        return await this.departmentRepository.findByName(name);
    }

    async findById(id: string) {
        return await this.departmentRepository.findById(id);
    }

    async findAll(query: {
        limit?: number;
        cursor?: string;
        search?: string;
        isActive?: boolean;
    }) {
        return await this.departmentRepository.findAll(query);
    }

    async updateDepartment(id: string, data: Partial<IDepartment>) {
        const department = await this.departmentRepository.updateDepartment(id, data);

        if (!department) {
            throw new NotFoundError("Department not found");
        }

        return department;
    }


    async deleteDepartment(id: string) {
        return await this.departmentRepository.deleteDepartment(id);
    }
}

export default DepartmentService