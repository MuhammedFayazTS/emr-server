import { Request, Response } from "express";

import { asyncHandler } from "@/middleware/async-handler";
import ApiResponse from "@/shared/utils/api-response";

import type UserService from "./user.service";

class UserController {
    private userService: UserService;
    constructor(userService: UserService) {
        this.userService = userService;
    }
}

export default UserController;
