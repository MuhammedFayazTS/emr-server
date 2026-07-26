import type { UserDocument } from "@/modules/user";

declare global {
    namespace Express {
        interface Request {
            user: UserDocument;
        }
    }
}

export {};
