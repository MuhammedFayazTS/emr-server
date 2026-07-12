import { ROLE_PERMISSIONS } from "@/shared/auth/role-permissions";
import { UserDocument, UserResponseDto, UserRole } from "./user.types";


export function toUserResponseDto(user: UserDocument): UserResponseDto {
    const permissions = ROLE_PERMISSIONS[user.role]
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role as UserRole,
        permissions,
        phone: user.phone,
        isActive: user.isActive,
        createdAt: user.createdAt,
    };
}