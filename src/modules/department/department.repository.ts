import { Types } from "mongoose";

import { Department } from "./department.model";

import type { IDepartment } from "./department.types";
import type { QueryFilter } from "mongoose";

class DepartmentRepository {
    async createDepartment(data: Partial<IDepartment>) {
        return await Department.create(data);
    }

    async findByName(name: string) {
        return await Department.findOne({ name });
    }

    async findById(id: string) {
        return await Department.findById(id);
    }

    async findAll(query: {
        limit?: number;
        cursor?: string; // last seen _id from previous page
        search?: string;
        isActive?: boolean;
    }) {
        const limit = query.limit || 10;

        const filter: QueryFilter<IDepartment> = {};

        if (query.cursor) {
            filter._id = { $gt: new Types.ObjectId(query.cursor) };
        }

        if (typeof query.isActive === "boolean") {
            filter.isActive = query.isActive;
        }

        if (query.search) {
            filter.name = { $regex: query.search, $options: "i" };
        }
        const departments = await Department.find(filter)
            .sort({ _id: 1 })
            .limit(limit + 1);

        const hasNextPage = departments.length > limit;
        const results = hasNextPage ? departments.slice(0, limit) : departments;

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

    async updateDepartment(id: string, data: Partial<IDepartment>) {
        return await Department.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteDepartment(id: string) {
        const department = await Department.findById(id);

        if (!department) {
            return null;
        }

        return await department.delete();
    }

    async restoreDepartment(id: string) {
        const department = await Department.findOneDeleted({ _id: id });
        if (!department) return null;
        return await department.restore();
    }
}

export default DepartmentRepository;
