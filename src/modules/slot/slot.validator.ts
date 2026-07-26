import { z } from "zod";

import { dateSchema } from "@/shared/validators/common-validators";

export const validateSlotQuery = z.object({
    date: dateSchema,
});
