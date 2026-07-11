import { toUserResponseDto } from "@modules/user/user.mapper";
import { ReceptionistResponseDto } from "./receptionist.types";

export function toReceptionistResponseDto(receptionist: any): ReceptionistResponseDto {
    return {
        ...toUserResponseDto(receptionist),
        assignedDesk: receptionist.assignedDesk,
    };
}
