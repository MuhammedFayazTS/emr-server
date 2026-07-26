import { asyncHandler } from "@/middleware/async-handler";
import type AuditLogService from "@/modules/audit-log/audit-log.service";
import ApiResponse from "@/shared/utils/api-response";
import { paramsDoctorIdSchema } from "@/shared/validators/common-validators";

import { validateSlotQuery } from "./slot.validator";

import type SlotService from "./slot.service";
import type { Request, Response } from "express";

// TODO: add redis cache for slots
class SlotController {
    private slotService: SlotService;
    private auditLogService?: AuditLogService;

    constructor(slotService: SlotService, auditLogService?: AuditLogService) {
        this.slotService = slotService;
        this.auditLogService = auditLogService;
    }

    generateSlots = asyncHandler(async (req: Request, res: Response) => {
        const { doctorId } = paramsDoctorIdSchema.parse(req.params);
        const { date } = validateSlotQuery.parse(req.query);

        const parsedDate = new Date(`${date}T00:00:00.000Z`);
        const slots = await this.slotService.generateSlots(doctorId, parsedDate);
        return ApiResponse.ok(res, "Slots generated successfully", slots);
    });
}

export default SlotController;
