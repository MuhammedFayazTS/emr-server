import { Types } from "mongoose";

import { Appointment } from "./appointment.model";
import { AppointmentStatus } from "./appointment.types";

import type { IAppointment, SearchAppointmentQuery } from "./appointment.types";

class AppointmentRepository {
    async create(data: Partial<IAppointment>) {
        return await Appointment.create(data);
    }

    async findById(id: string) {
        return await Appointment.findById(id)
            .populate("patientId", "firstName lastName email phone")
            .populate("doctorId", "name email")
            .populate("departmentId", "name");
    }

    async findByDoctor(doctorId: string, date?: Date) {
        const filter: Record<string, any> = { doctorId };
        if (date) filter.date = date;
        return await Appointment.find(filter)
            .populate("patientId", "firstName lastName email phone")
            .populate("departmentId", "name")
            .sort({ startTime: 1 });
    }

    async findByPatient(patientId: string) {
        return await Appointment.find({ patientId })
            .populate("doctorId", "name email")
            .populate("departmentId", "name")
            .sort({ date: -1, startTime: -1 });
    }

    async update(id: string, data: Partial<IAppointment>) {
        return await Appointment.findByIdAndUpdate(id, data, { new: true })
            .populate("patientId", "firstName lastName email phone")
            .populate("doctorId", "name email")
            .populate("departmentId", "name");
    }

    async cancel(id: string, cancelledBy: string, cancelReason: string) {
        return await Appointment.findByIdAndUpdate(
            id,
            {
                status: AppointmentStatus.CANCELLED,
                cancelledAt: new Date(),
                cancelledBy: new Types.ObjectId(cancelledBy),
                cancelReason,
            },
            { new: true },
        )
            .populate("patientId", "firstName lastName email phone")
            .populate("doctorId", "name email")
            .populate("departmentId", "name");
    }

    // sperated methods for status updates due to status specific work needed in future
    async markArrived(id: string) {
        return await Appointment.findByIdAndUpdate(
            id,
            { status: AppointmentStatus.ARRIVED },
            { new: true },
        );
    }

    async markInProgress(id: string) {
        return await Appointment.findByIdAndUpdate(
            id,
            { status: AppointmentStatus.IN_PROGRESS },
            { new: true },
        );
    }

    async markCompleted(id: string) {
        return await Appointment.findByIdAndUpdate(
            id,
            { status: AppointmentStatus.COMPLETED },
            { new: true },
        );
    }

    async existsByDoctorAndSlot(doctorId: string, date: Date, startTime: string) {
        return await Appointment.exists({
            doctorId,
            date,
            startTime,
            status: { $nin: [AppointmentStatus.CANCELLED] },
        });
    }

    async findAll(query: SearchAppointmentQuery) {
        const limit = query.limit || 10;
        const filter: Record<string, any> = {};

        if (query.cursor) {
            filter._id = { $gt: new Types.ObjectId(query.cursor) };
        }

        if (query.doctorId) {
            filter.doctorId = new Types.ObjectId(query.doctorId);
        }

        if (query.departmentId) {
            filter.departmentId = new Types.ObjectId(query.departmentId);
        }

        if (query.patientId) {
            filter.patientId = new Types.ObjectId(query.patientId);
        }

        if (query.status) {
            filter.status = query.status;
        }

        if (query.dateFrom || query.dateTo) {
            filter.date = {};
            if (query.dateFrom) filter.date.$gte = new Date(`${query.dateFrom}T00:00:00.000Z`);
            if (query.dateTo) filter.date.$lte = new Date(`${query.dateTo}T23:59:59.999Z`);
        }

        const appointments = await Appointment.find(filter)
            .populate("patientId", "firstName lastName email phone")
            .populate("doctorId", "name email")
            .populate("departmentId", "name")
            .sort({ _id: 1 })
            .limit(limit + 1);

        const hasNextPage = appointments.length > limit;
        const results = hasNextPage ? appointments.slice(0, limit) : appointments;

        return {
            data: results,
            pagination: {
                nextCursor: hasNextPage ? results[results.length - 1]._id.toString() : null,
                hasNextPage,
                limit,
            },
        };
    }

    async countByDoctorAndDate(doctorId: string, date: Date) {
        return await Appointment.countDocuments({
            doctorId,
            date,
            status: { $nin: [AppointmentStatus.CANCELLED] },
        });
    }

    async findBookedSlotsByDoctorAndDate(doctorId: string, date: Date) {
        return await Appointment.find(
            {
                doctorId,
                date,
                status: {
                    $nin: [AppointmentStatus.CANCELLED],
                },
            },
            {
                startTime: 1,
            },
        ).lean();
    }
}

export default AppointmentRepository;
