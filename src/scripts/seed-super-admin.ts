import "dotenv/config";
import mongoose from "mongoose";

import DatabaseConfig from "@/config/db";
import UserRepository from "@/modules/user/user.repository";
import UserService from "@/modules/user/user.service";

async function seedSuperAdmin() {
    await DatabaseConfig.connect();

    const userService = new UserService(new UserRepository());

    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;
    const name = process.env.SUPER_ADMIN_NAME ?? "System Administrator";

    if (!email || !password) {
        throw new Error("SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in .env");
    }

    const existing = await userService.getUserByEmail(email);
    if (existing) {
        console.log(`Super Admin already exists: ${email}`);
        await mongoose.disconnect();
        process.exit(0);
    }

    const superAdmin = await userService.createSuperAdmin({
        name,
        email,
        password,
        phone: "+91 1234567890",
    });

    console.log(`Super Admin created: ${superAdmin.email} (id: ${superAdmin.id})`);
    await mongoose.disconnect();
    process.exit(0);
}

seedSuperAdmin().catch(async (err) => {
    console.error("Seeding failed:", err);
    await mongoose.disconnect();
    process.exit(1);
});
