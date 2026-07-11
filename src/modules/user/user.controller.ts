import { Request, Response } from "express";
import UserService from "./user.service";
import { asyncHandler } from "@/middleware/async-handler";
import ApiResponse from "@/shared/utils/api-response";

class UserController {
    private userService: UserService;
    constructor(userService: UserService) {
        this.userService = userService;
    }
}

export default UserController;