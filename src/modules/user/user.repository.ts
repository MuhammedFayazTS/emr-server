import { Receptionist } from "./discriminators/receptionist.model";
import { SuperAdmin } from "./discriminators/super-admin.model";
import { User } from "./user.model";

import type { IUser, IReceptionist, ISuperAdmin } from "./user.types";

class UserRepository {
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
        userAgent?: string,
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
            },
        );
    }

    async findUserWithRefreshToken(userId: string, tokenId: string) {
        return User.findOne(
            {
                _id: userId,
                "refreshTokens.tokenId": tokenId,
            },
            {
                role: 1,
                "refreshTokens.$": 1,
            },
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
        },
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
            },
        );
    }

    async removeRefreshToken(userId: string, tokenId: string) {
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
            },
        );
    }
}

export default UserRepository;
