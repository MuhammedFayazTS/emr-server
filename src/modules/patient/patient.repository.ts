import { Types } from "mongoose";

import { Patient } from "./patient.model";

import type { IPatient, SearchPatientQuery } from "./patient.types";

class PatientRepository {
    async create(data: Partial<IPatient>) {
        return await Patient.create(data);
    }

    async findById(id: string) {
        return await Patient.findById(id);
    }

    async findByPatientId(patientId: string) {
        return await Patient.findOne({ patientId });
    }

    async findByPhone(phone: string) {
        return await Patient.findOne({ phone });
    }

    async findByEmail(email: string) {
        return await Patient.findOne({ email });
    }

    async update(id: string, data: Partial<IPatient>) {
        return await Patient.findByIdAndUpdate(id, data, { new: true });
    }

    async existsByPhone(phone: string) {
        return await Patient.exists({ phone });
    }

    async existsByEmail(email: string) {
        return await Patient.exists({ email });
    }

    async findAll(query: SearchPatientQuery) {
        const limit = query.limit || 20;
        const filter: Record<string, any> = {};

        if (query.cursor) {
            filter._id = { $gt: new Types.ObjectId(query.cursor) };
        }

        if (typeof query.isActive === "boolean") {
            filter.isActive = query.isActive;
        }

        // Specific filters take priority
        if (query.patientId) {
            filter.patientId = { $regex: query.patientId, $options: "i" };
        }

        if (query.phone) {
            filter.phone = { $regex: query.phone, $options: "i" };
        }

        // Generic search: matches firstName, lastName, or patientId
        if (query.search) {
            filter.$or = [
                { firstName: { $regex: query.search, $options: "i" } },
                { lastName: { $regex: query.search, $options: "i" } },
                { patientId: { $regex: query.search, $options: "i" } },
            ];
        }

        const patients = await Patient.find(filter)
            .sort({ _id: 1 })
            .limit(limit + 1);

        const hasNextPage = patients.length > limit;
        const results = hasNextPage ? patients.slice(0, limit) : patients;

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

    async getNextSequence(): Promise<number> {
        const result = await Patient.findOne().sort({ patientId: -1 }).select("patientId").lean();

        if (!result || !result.patientId) return 1;

        const num = parseInt(result.patientId.replace("PAT", ""), 10);
        return isNaN(num) ? 1 : num + 1;
    }
}

export default PatientRepository;
