import type { loginSchema } from "./auth.validator";
import type z from "zod";

export type LoginDto = z.infer<typeof loginSchema>;
