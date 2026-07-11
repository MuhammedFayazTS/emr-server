import z from "zod";

export const createDepartmentSchema = z.object({
    name: z.string().min(1, "Department name is required").max(100, "Department name must be less than 100 characters"),
    description: z.string().max(500, "Department description must be less than 500 characters"),
    isActive: z.boolean().default(true),
});

export const updateDepartmentSchema = createDepartmentSchema
    .omit({ isActive: true })
    .extend({ isActive: z.boolean().optional() })
    .partial();