import { User } from "./user.model";
import { Doctor } from "./discriminators/doctor.model";
import { Receptionist } from "./discriminators/receptionist.model";
import { SuperAdmin } from "./discriminators/super-admin.model";
import { IUser, IDoctor, IReceptionist, ISuperAdmin } from "./user.types";
class UserRepository {
    async createDoctor(data: Partial<IUser> & IDoctor) {
        return await Doctor.create(data);
    }

    async createReceptionist(data: Partial<IUser> & IReceptionist) {
        return await Receptionist.create(data);
    }

    async createSuperAdmin(data: Partial<IUser> & ISuperAdmin) {
        return await SuperAdmin.create(data);
    }

    async findByEmail(email: string) {
        return await User.findOne({ email });
    }

    async findByEmailWithPassword(email: string) {
        return await User.findOne({ email }).select("+password");
    }

    async findById(id: string) {
        return await User.findById(id);
    }

    async addRefreshToken(
        userId: string,
        tokenId: string,
        tokenHash: string,
        expiresAt: Date,
        userAgent?: string
    ) {
        return User.findByIdAndUpdate(
            userId,
            {
                $push: {
                    refreshTokens: {
                        tokenId,
                        tokenHash,
                        expiresAt,
                        userAgent,
                    },
                },
                $set: {
                    lastLoginAt: new Date(),
                },
            },
            {
                new: true,
            }
        );
    }
}

export default UserRepository;