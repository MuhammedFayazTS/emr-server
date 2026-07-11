import { DoctorResponseDto, UserDocument, UserResponseDto } from "./user.types";


export function toUserResponseDto(user: UserDocument): UserResponseDto {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role as any, // set by discriminatorKey, always present on a saved doc
        phone: user.phone,
        isActive: user.isActive,
        createdAt: user.createdAt,
    };
}

export function toDoctorResponseDto(doctor: any): DoctorResponseDto {
    return {
        ...toUserResponseDto(doctor),
        department: doctor.department,
        specialization: doctor.specialization,
        scheduleId: doctor.scheduleId,
        qualification: doctor.qualification,
    };
}