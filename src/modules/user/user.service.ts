import { toUserResponseDto } from "./user.mapper";
import UserRepository from "./user.repository";
import { CreateDoctorDto, CreateReceptionistDto, CreateSuperAdminDto, UserResponseDto } from "./user.types";

class UserService {
    private repository: UserRepository;

    constructor(repository: UserRepository) {
        this.repository = repository;
    }

    async createDoctor(data: CreateDoctorDto): Promise<UserResponseDto> {
        const doctor = await this.repository.createDoctor(data);
        return toUserResponseDto(doctor);
    }

    async createReceptionist(data: CreateReceptionistDto): Promise<UserResponseDto> {
        const receptionist = await this.repository.createReceptionist(data);
        return toUserResponseDto(receptionist);
    }

    async createSuperAdmin(data: CreateSuperAdminDto): Promise<UserResponseDto> {
        const superAdmin = await this.repository.createSuperAdmin(data);
        return toUserResponseDto(superAdmin);
    }

    async getUserByEmail(email: string): Promise<UserResponseDto | null> {
        const user = await this.repository.findByEmail(email);
        if (!user) return null
        return toUserResponseDto(user)
    }

    async getUserById(id: string): Promise<UserResponseDto | null> {
        const user = await this.repository.findById(id);
        if (!user) return null
        return toUserResponseDto(user)
    }

    async getUserByEmailWithPass(email: string) {
        return await this.repository.findByEmailWithPassword(email);
    }
}

export default UserService;