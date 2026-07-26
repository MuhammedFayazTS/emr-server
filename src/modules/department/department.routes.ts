import express from "express";

import { authorize } from "@/middleware/authorize";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { departmentController } from "@modules/department";

const router = express.Router();

router.post("/", authorize(PERMISSIONS.DEPARTMENT.CREATE), departmentController.createDepartment);

router.get("/", authorize(PERMISSIONS.DEPARTMENT.VIEW), departmentController.getAllDepartments);

router.get("/:id", authorize(PERMISSIONS.DEPARTMENT.VIEW), departmentController.getDepartment);

router.put("/:id", authorize(PERMISSIONS.DEPARTMENT.UPDATE), departmentController.updateDepartment);

router.patch(
    "/:id/status",
    authorize(PERMISSIONS.DEPARTMENT.UPDATE),
    departmentController.updateDepartmentStatus,
);

router.patch(
    "/:id/restore",
    authorize(PERMISSIONS.DEPARTMENT.UPDATE),
    departmentController.restoreDepartment,
);

router.delete(
    "/:id",
    authorize(PERMISSIONS.DEPARTMENT.DELETE),
    departmentController.deleteDepartment,
);

export default router;
