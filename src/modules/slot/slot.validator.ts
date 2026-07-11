import { dateSchema } from "@/shared/validators/common-validators";
import { z } from "zod";

export const validateSlotQuery = z.object({
    date: dateSchema,
})