import { Types } from "mongoose";

import { Receptionist } from "./receptionist.model";

import type { IReceptionist } from "./receptionist.types";
import type { IUser } from "@modules/user/user.types";
import type { QueryFilter } from "mongoose";

class ReceptionistRepository {
    async createReceptionist(data: Partial<IUser> & IReceptionist) {
        return await Receptionist.create(data);
    }

    async updateReceptionist(id: string, data: Partial<IUser> & Partial<IReceptionist>) {
        return await Receptionist.findByIdAndUpdate(id, data, { new: true });
    }

    async findAllReceptionists(query: {
        limit?: number;
        cursor?: string;
        search?: string;
        isActive?: boolean;
    }) {
        const limit = query.limit || 10;

        const filter: QueryFilter<IUser & IReceptionist> = {};

        if (query.cursor) {
            filter._id = { $gt: new Types.ObjectId(query.cursor) };
        }

        if (typeof query.isActive === "boolean") {
            filter.isActive = query.isActive;
        }

        if (query.search) {
            filter.name = { $regex: query.search, $options: "i" };
        }

        const receptionists = await Receptionist.find(filter)
            .sort({ _id: 1 })
            .limit(limit + 1);

        const hasNextPage = receptionists.length > limit;
        const results = hasNextPage ? receptionists.slice(0, limit) : receptionists;

        return {
            data: results,
            pagination: {
                nextCursor: hasNextPage ? results[results.length - 1]._id.toString() : null,
                hasNextPage,
                limit,
            },
        };
    }

    async findReceptionistById(id: string) {
        return await Receptionist.findById(id);
    }

    async deleteReceptionist(id: string) {
        const receptionist = await Receptionist.findById(id);
        if (!receptionist) return null;
        return await receptionist.delete();
    }
}

export default ReceptionistRepository;
