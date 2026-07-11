import { toUserResponseDto } from "@modules/user/user.mapper";
import { DoctorResponseDto } from "./doctor.types";

export function toDoctorResponseDto(doctor: any): DoctorResponseDto {
    return {
        ...toUserResponseDto(doctor),
        department: doctor.department,
        specialization: doctor.specialization,
        scheduleId: doctor.scheduleId,
        qualification: doctor.qualification,
    };
}
