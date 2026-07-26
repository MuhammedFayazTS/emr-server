import { Types } from "mongoose";

import { Doctor } from "./doctor.model";

import type { IDoctor } from "./doctor.types";
import type { IUser } from "@modules/user/user.types";
import type { QueryFilter } from "mongoose";

class DoctorRepository {
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
                nextCursor: hasNextPage
                    ? (results[results.length - 1]?._id.toString() ?? null)
                    : null,
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
}

export default DoctorRepository;
