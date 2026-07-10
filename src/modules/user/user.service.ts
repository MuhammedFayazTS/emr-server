import { hashValue } from "@/shared/utils/bcrypt";
import { toUserResponseDto } from "./user.mapper";
import UserRepository from "./user.repository";
import { CreateDoctorDto, CreateReceptionistDto, CreateSuperAdminDto, UserDocument, UserResponseDto } from "./user.types";

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

    async getUserDocumentById(id: string): Promise<UserDocument | null> {
        return await this.repository.findById(id);
    }

    async getUserById(id: string): Promise<UserResponseDto | null> {
        const user = await this.getUserDocumentById(id);
        if (!user) return null
        return toUserResponseDto(user)
    }

    async getUserByEmailWithPass(email: string) {
        return await this.repository.findByEmailWithPassword(email);
    }

    async saveRefreshToken(
        userId: string,
        tokenId: string,
        refreshToken: string,
        expiresAt: Date,
        userAgent?: string
    ) {
        const tokenHash = await hashValue(refreshToken);
        return this.repository.addRefreshToken(
            userId,
            tokenId,
            tokenHash,
            expiresAt,
            userAgent
        );
    }

    async getUserWithRefreshToken(
        userId: string,
        tokenId: string
    ) {
        return this.repository.findUserWithRefreshToken(
            userId,
            tokenId
        );
    }

    async rotateRefreshToken(
        userId: string,
        oldTokenId: string,
        newTokenId: string,
        refreshToken: string,
        expiresAt: Date,
        userAgent?: string
    ) {
        const tokenHash = await hashValue(refreshToken);
        return this.repository.replaceRefreshToken(
            userId,
            oldTokenId,
            {
                tokenId: newTokenId,
                tokenHash,
                expiresAt,
                userAgent,
            }
        );
    }

    async revokeRefreshToken(
        userId: string,
        tokenId: string
    ) {
        return this.repository.removeRefreshToken(userId, tokenId);
    }
}

export default UserService;