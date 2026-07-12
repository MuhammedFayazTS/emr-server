import { DoctorSchedule } from "./doctor-schedule.model";
import { IDoctorSchedule } from "./doctor-schedule.types";
import { Types } from "mongoose";

class DoctorScheduleRepository {
    async create(data: Partial<IDoctorSchedule>) {
        return await DoctorSchedule.create(data);
    }

    async update(id: string, data: Partial<IDoctorSchedule>) {
        return await DoctorSchedule.findByIdAndUpdate(id, data, { new: true });
    }

    async findById(id: string) {
        return await DoctorSchedule.findById(id)
        .populate("doctorId", "name email");
    }

    async findByDoctorId(doctorId: string) {
        return await DoctorSchedule.findOne({ doctorId });
    }

    async findAll(query: {
        limit?: number;
        cursor?: string;
        isActive?: boolean;
    }) {
        const limit = query.limit || 10;

        const filter: Record<string, any> = {};

        if (query.cursor) {
            filter._id = { $gt: new Types.ObjectId(query.cursor) };
        }

        if (typeof query.isActive === "boolean") {
            filter.isActive = query.isActive;
        }

        const schedules = await DoctorSchedule.find(filter)
            .populate("doctorId", "name email")
            .sort({ _id: 1 })
            .limit(limit + 1);

        const hasNextPage = schedules.length > limit;
        const results = hasNextPage ? schedules.slice(0, limit) : schedules;

        return {
            data: results,
            pagination: {
                nextCursor: hasNextPage ? results[results.length - 1]._id.toString() : null,
                hasNextPage,
                limit,
            },
        };
    }

    async delete(id: string) {
        return await DoctorSchedule.findByIdAndDelete(id);
    }
}

export default DoctorScheduleRepository;
