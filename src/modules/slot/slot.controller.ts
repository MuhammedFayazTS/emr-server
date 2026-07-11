import { asyncHandler } from "@/middleware/async-handler";
import SlotService from "./slot.service";
import { paramsDoctorIdSchema } from "@/shared/validators/common-validators";
import { validateSlotQuery } from "./slot.validator";
import ApiResponse from "@/shared/utils/api-response";

// TODO: add redis cache for slots
class SlotController {
    private slotService: SlotService
    constructor(slotService: SlotService) {
        this.slotService = slotService;
    }

    generateSlots = asyncHandler(async (req, res) => {
        const { doctorId } = paramsDoctorIdSchema.parse(req.params);
        const { date } = validateSlotQuery.parse(req.query)

        const parsedDate = new Date(`${date}T00:00:00.000Z`);
        const slots = await this.slotService.generateSlots(doctorId, parsedDate);
        return ApiResponse.ok(res, "Slots generated successfully", slots);
    })
}

export default SlotController