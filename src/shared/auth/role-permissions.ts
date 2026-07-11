import { UserRole } from "@/modules/user/user.types";
import { PERMISSIONS, Permission } from "@constants/permissions";

export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
    [UserRole.SUPER_ADMIN]: [
        ...Object.values(PERMISSIONS.USER),

        ...Object.values(PERMISSIONS.DOCTOR),

        ...Object.values(PERMISSIONS.RECEPTIONIST),

        ...Object.values(PERMISSIONS.PATIENT),

        ...Object.values(PERMISSIONS.DEPARTMENT),

        ...Object.values(PERMISSIONS.SCHEDULE),

        ...Object.values(PERMISSIONS.APPOINTMENT),

        ...Object.values(PERMISSIONS.DASHBOARD),

        ...Object.values(PERMISSIONS.AUDIT),
    ],

    [UserRole.RECEPTIONIST]: [
        PERMISSIONS.PATIENT.CREATE,
        PERMISSIONS.PATIENT.VIEW,
        PERMISSIONS.PATIENT.UPDATE,

        PERMISSIONS.APPOINTMENT.CREATE,
        PERMISSIONS.APPOINTMENT.VIEW,
        PERMISSIONS.APPOINTMENT.UPDATE,
        PERMISSIONS.APPOINTMENT.ARRIVE,

        PERMISSIONS.DASHBOARD.VIEW,
    ],

    [UserRole.DOCTOR]: [
        PERMISSIONS.APPOINTMENT.VIEW,

        PERMISSIONS.PATIENT.VIEW,

        PERMISSIONS.DASHBOARD.VIEW,
    ],
};