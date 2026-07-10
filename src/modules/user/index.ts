import UserRepository from "./user.repository";
import UserService from "./user.service";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export { userRepository, userService, UserRepository, UserService };
export * from "./user.model";
export * from "./user.types";
export * from "./discriminators/doctor.model";
export * from "./discriminators/receptionist.model";
export * from "./discriminators/super-admin.model";
