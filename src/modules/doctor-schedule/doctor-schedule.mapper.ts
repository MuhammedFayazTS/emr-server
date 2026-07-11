import { DoctorScheduleResponseDto } from "./doctor-schedule.types";

export function toDoctorScheduleResponseDto(schedule: any): DoctorScheduleResponseDto {
    return {
        id: schedule._id.toString(),
        doctorId: schedule.doctorId?.toString?.() ?? schedule.doctorId,
        isActive: schedule.isActive,
        slotDuration: schedule.slotDuration,
        workingDays: schedule.workingDays,
        createdAt: schedule.createdAt,
        updatedAt: schedule.updatedAt,
    };
}
