import { User } from "./user.model";
import { Doctor } from "./discriminators/doctor.model";
import { Receptionist } from "./discriminators/receptionist.model";
import { SuperAdmin } from "./discriminators/super-admin.model";
import { IUser, IDoctor, IReceptionist, ISuperAdmin } from "./user.types";
import { QueryFilter, Types } from "mongoose";

class UserRepository {
    async createDoctor(data: Partial<IUser> & IDoctor) {
        return await Doctor.create(data);
    }

    async updateDoctor(id: string, data: Partial<IUser> & IDoctor) {
        return await Doctor.findByIdAndUpdate(id, data, { new: true });
    }

    async findAllDoctors(query: {
        limit?: number;
        cursor?: string;
        search?: string;
        isActive?: boolean;
    }) {
        const limit = query.limit || 10;

        const filter: QueryFilter<IUser & IDoctor> = {};

        if (query.cursor) {
            filter._id = { $gt: new Types.ObjectId(query.cursor) };
        }

        if (typeof query.isActive === "boolean") {
            filter.isActive = query.isActive;
        }

        if (query.search) {
            filter.name = { $regex: query.search, $options: "i" };
        }

        const doctors = await Doctor.find(filter)
            .populate("department", "name")
            .sort({ _id: 1 })
            .limit(limit + 1);

        const hasNextPage = doctors.length > limit;
        const results = hasNextPage ? doctors.slice(0, limit) : doctors;

        return {
            data: results,
            pagination: {
                nextCursor: hasNextPage ? results[results.length - 1]._id.toString() : null,
                hasNextPage,
                limit,
            },
        };
    }

    async findDoctorById(id: string) {
        return await Doctor.findById(id).populate("department", "name");
    }

    async deleteDoctor(id: string) {
        const doctor = await Doctor.findById(id);
        if (!doctor) return null;
        return await doctor.delete();
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

    async findUserWithRefreshToken(
        userId: string,
        tokenId: string
    ) {
        return User.findOne(
            {
                _id: userId,
                "refreshTokens.tokenId": tokenId,
            },
            {
                role: 1,
                "refreshTokens.$": 1,
            }
        );
    }

    async replaceRefreshToken(
        userId: string,
        oldTokenId: string,
        newToken: {
            tokenId: string;
            tokenHash: string;
            expiresAt: Date;
            userAgent?: string;
        }
    ) {
        return User.findOneAndUpdate(
            {
                _id: userId,
                "refreshTokens.tokenId": oldTokenId,
            },
            {
                $set: {
                    "refreshTokens.$": newToken,
                },
            },
            {
                new: true,
            }
        );
    }

    async removeRefreshToken(
        userId: string,
        tokenId: string
    ) {
        return User.findOneAndUpdate(
            {
                _id: userId,
                "refreshTokens.tokenId": tokenId,
            },
            {
                $pull: {
                    refreshTokens: {
                        tokenId,
                    },
                },
            },
            {
                new: true,
            }
        );
    }
}

export default UserRepository;