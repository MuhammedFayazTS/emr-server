export const PERMISSIONS = {
    USER: {
        CREATE: "user:create",
        VIEW: "user:view",
        UPDATE: "user:update",
        DELETE: "user:delete",
    },

    DOCTOR: {
        CREATE: "doctor:create",
        VIEW: "doctor:view",
        UPDATE: "doctor:update",
        DELETE: "doctor:delete",
    },

    RECEPTIONIST: {
        CREATE: "receptionist:create",
        VIEW: "receptionist:view",
        UPDATE: "receptionist:update",
        DELETE: "receptionist:delete",
    },

    PATIENT: {
        CREATE: "patient:create",
        VIEW: "patient:view",
        UPDATE: "patient:update",
        DELETE: "patient:delete",
        STATUS_UPDATE: "patient:status_update",
    },

    DEPARTMENT: {
        CREATE: "department:create",
        VIEW: "department:view",
        UPDATE: "department:update",
        DELETE: "department:delete",
    },

    SCHEDULE: {
        CREATE: "schedule:create",
        VIEW: "schedule:view",
        UPDATE: "schedule:update",
        DELETE: "schedule:delete",
    },

    SLOT: {
        VIEW: "slot:view",
    },

    APPOINTMENT: {
        CREATE: "appointment:create",
        VIEW: "appointment:view",
        UPDATE: "appointment:update",
        CANCEL: "appointment:cancel",
        ARRIVE: "appointment:arrive",
    },

    DASHBOARD: {
        VIEW: "dashboard:view",
    },

    AUDIT: {
        VIEW: "audit:view",
    },
} as const;

type PermissionGroup = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export type Permission = {
    [K in keyof typeof PERMISSIONS]: (typeof PERMISSIONS)[K][keyof (typeof PERMISSIONS)[K]];
}[keyof typeof PERMISSIONS];