import UserRepository from "./user.repository";
import UserService from "./user.service";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export { userRepository, userService, UserRepository, UserService };
