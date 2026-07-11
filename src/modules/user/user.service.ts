import { hashValue } from "@/shared/auth/bcrypt";
import { toDoctorResponseDto, toUserResponseDto } from "./user.mapper";
import UserRepository from "./user.repository";
import { CreateDoctorDto, CreateReceptionistDto, CreateSuperAdminDto, DoctorResponseDto, UpdateDoctorDto, UserDocument, UserResponseDto, UserRole } from "./user.types";
import { Types } from "mongoose";
import { NotFoundError } from "@/shared/errors/CommonExceptions";

class UserService {
    private repository: UserRepository;

    constructor(repository: UserRepository) {
        this.repository = repository;
    }

    // doctor services

    async createDoctor(data: CreateDoctorDto): Promise<UserResponseDto> {
        const doctor = await this.repository.createDoctor({
            ...data,
            role: UserRole.DOCTOR,
            department: new Types.ObjectId(data.department),
            scheduleId: data.scheduleId ? new Types.ObjectId(data.scheduleId) : undefined,
        });
        return toDoctorResponseDto(doctor);
    }

    async updateDoctor(id: string, data: UpdateDoctorDto): Promise<UserResponseDto> {
        const doctor = await this.repository.updateDoctor(id, {
            ...data,
            department: new Types.ObjectId(data.department),
            scheduleId: data.scheduleId ? new Types.ObjectId(data.scheduleId) : undefined,
        });
        if (!doctor) throw new NotFoundError("Doctor not found")
        return toDoctorResponseDto(doctor);
    }

    async getAllDoctors(query: {
        limit?: number;
        cursor?: string;
        search?: string;
        isActive?: boolean;
    }) {
        const result = await this.repository.findAllDoctors(query);
        return {
            data: result.data.map(toDoctorResponseDto),
            pagination: result.pagination,
        };
    }

    async getDoctorById(id: string): Promise<DoctorResponseDto> {
        const doctor = await this.repository.findDoctorById(id);
        if (!doctor) throw new NotFoundError("Doctor not found");
        return toDoctorResponseDto(doctor);
    }

    async deleteDoctor(id: string): Promise<DoctorResponseDto> {
        const doctor = await this.repository.deleteDoctor(id);
        if (!doctor) throw new NotFoundError("Doctor not found");
        return toDoctorResponseDto(doctor);
    }

    // receptionist services
    async createReceptionist(data: CreateReceptionistDto): Promise<UserResponseDto> {
        const receptionist = await this.repository.createReceptionist({ ...data, role: UserRole.RECEPTIONIST });
        return toUserResponseDto(receptionist);
    }

    // super admin services
    async createSuperAdmin(data: CreateSuperAdminDto): Promise<UserResponseDto> {
        const superAdmin = await this.repository.createSuperAdmin({ ...data, role: UserRole.SUPER_ADMIN });
        return toUserResponseDto(superAdmin);
    }

    // common services
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