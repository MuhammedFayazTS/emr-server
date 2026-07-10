import { AuthService } from "@/modules/auth/auth.service";
import { AuthController } from "@/modules/auth/auth.controller";
import { UserRepository, UserService } from "../user";

const userRepository = new UserRepository();
const userService = new UserService(userRepository)
const authService = new AuthService(userService);
const authController = new AuthController(authService);

export { authController };