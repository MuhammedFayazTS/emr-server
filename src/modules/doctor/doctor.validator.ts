import z from "zod";
import { objectIdSchema } from "@/shared/validators/common-validators";
import { createUserSchema } from "@modules/user/user.validator";

export const createDoctorSchema = createUserSchema.extend({
    // role: z.literal(UserRole.DOCTOR),
    department: objectIdSchema,
    specialization: z.string().optional(),
    qualification: z.string().optional(),
    scheduleId: objectIdSchema.optional(),
});

export const updateDoctorSchema = createDoctorSchema.partial();
