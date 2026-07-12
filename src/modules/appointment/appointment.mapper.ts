import { AppointmentResponseDto } from "./appointment.types";

export interface PaginatedAppointmentResponse {
    data: AppointmentResponseDto[];
    pagination: {
        nextCursor: string | null;
        hasNextPage: boolean;
        limit: number;
    };
}

export function toAppointmentResponseDto(appointment: any): AppointmentResponseDto {
    return {
        id: appointment._id.toString(),
        appointmentNumber: appointment.appointmentNumber,
        patientId: appointment.patientId?._id ? appointment.patientId : appointment.patientId?.toString?.() ?? appointment.patientId,
        doctorId: appointment.doctorId?._id ? appointment.doctorId : appointment.doctorId?.toString?.() ?? appointment.doctorId,
        departmentId: appointment.departmentId?._id ? appointment.departmentId : appointment.departmentId?.toString?.() ?? appointment.departmentId,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        purpose: appointment.purpose,
        notes: appointment.notes,
        cancelledAt: appointment.cancelledAt,
        cancelledBy: appointment.cancelledBy?.toString?.() ?? appointment.cancelledBy,
        cancelReason: appointment.cancelReason,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
    };
}

export function toPaginatedAppointmentResponse(data: any[], pagination: any): PaginatedAppointmentResponse {
    return {
        data: data.map(toAppointmentResponseDto),
        pagination: {
            nextCursor: pagination.nextCursor ?? null,
            hasNextPage: pagination.hasNextPage ?? false,
            limit: pagination.limit ?? 10,
        }
    };
}
