import UserController from "./user.controller";
import UserRepository from "./user.repository";
import UserService from "./user.service";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService)

export { userRepository, userService, userController, UserRepository, UserService };
