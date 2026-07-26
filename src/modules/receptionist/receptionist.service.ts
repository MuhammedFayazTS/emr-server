import { NotFoundError } from "@/shared/errors/CommonExceptions";
import { UserRole } from "@modules/user/user.types";

import { toReceptionistResponseDto } from "./receptionist.mapper";

import type ReceptionistRepository from "./receptionist.repository";
import type {
    CreateReceptionistDto,
    ReceptionistResponseDto,
    UpdateReceptionistDto,
} from "./receptionist.types";

class ReceptionistService {
    private repository: ReceptionistRepository;

    constructor(repository: ReceptionistRepository) {
        this.repository = repository;
    }

    async createReceptionist(data: CreateReceptionistDto): Promise<ReceptionistResponseDto> {
        const receptionist = await this.repository.createReceptionist({
            ...data,
            role: UserRole.RECEPTIONIST,
        });
        return toReceptionistResponseDto(receptionist);
    }

    async updateReceptionist(
        id: string,
        data: UpdateReceptionistDto,
    ): Promise<ReceptionistResponseDto> {
        const receptionist = await this.repository.updateReceptionist(id, data);
        if (!receptionist) throw new NotFoundError("Receptionist not found");
        return toReceptionistResponseDto(receptionist);
    }

    async getAllReceptionists(query: {
        limit?: number;
        cursor?: string;
        search?: string;
        isActive?: boolean;
    }) {
        const result = await this.repository.findAllReceptionists(query);
        return {
            data: result.data.map(toReceptionistResponseDto),
            pagination: result.pagination,
        };
    }

    async getReceptionistById(id: string): Promise<ReceptionistResponseDto> {
        const receptionist = await this.repository.findReceptionistById(id);
        if (!receptionist) throw new NotFoundError("Receptionist not found");
        return toReceptionistResponseDto(receptionist);
    }

    async deleteReceptionist(id: string): Promise<ReceptionistResponseDto> {
        const receptionist = await this.repository.deleteReceptionist(id);
        if (!receptionist) throw new NotFoundError("Receptionist not found");
        return toReceptionistResponseDto(receptionist);
    }
}

export default ReceptionistService;
