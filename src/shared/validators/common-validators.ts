import { z } from "zod";

const emailSchema = z.string().email("Invalid email format");

export const emailValidator = {
    validator: (v: string) => emailSchema.safeParse(v).success,
    message: "Invalid email format"
};
