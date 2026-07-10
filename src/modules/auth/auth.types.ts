import z from "zod";
import { loginSchema } from "./auth.validator";

export type LoginDto = z.infer<typeof loginSchema>;