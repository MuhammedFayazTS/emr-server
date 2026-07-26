import type { UserRole } from "@/modules/user/user.types";

import { ROLE_PERMISSIONS } from "./role-permissions";

import type { Permission } from "@constants/permissions";

class PermissionService {
    getPermissions(role: UserRole): readonly Permission[] {
        return ROLE_PERMISSIONS[role] ?? [];
    }

    hasPermission(role: UserRole, permission: Permission): boolean {
        return this.getPermissions(role).includes(permission);
    }

    hasAnyPermission(role: UserRole, permissions: readonly Permission[]): boolean {
        const rolePermissions = this.getPermissions(role);

        return permissions.some((permission) => rolePermissions.includes(permission));
    }

    hasAllPermissions(role: UserRole, permissions: readonly Permission[]): boolean {
        const rolePermissions = this.getPermissions(role);

        return permissions.every((permission) => rolePermissions.includes(permission));
    }
}

export default new PermissionService();
