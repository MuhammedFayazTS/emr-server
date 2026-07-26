import type { PatientResponseDto } from "./patient.types";

export function toPatientResponseDto(patient: any): PatientResponseDto {
    return {
        id: patient._id.toString(),
        patientId: patient.patientId,
        firstName: patient.firstName,
        lastName: patient.lastName,
        gender: patient.gender,
        dateOfBirth: patient.dateOfBirth,
        phone: patient.phone,
        email: patient.email,
        bloodGroup: patient.bloodGroup,
        address: patient.address,
        emergencyContact: patient.emergencyContact,
        isActive: patient.isActive,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt,
    };
}
