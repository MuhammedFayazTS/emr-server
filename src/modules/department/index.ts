import DepartmentService from "@/modules/department/department.service";
import DepartmentController from "@/modules/department/department.controller";
import DepartmentRepository from "@/modules/department/department.repository";

const departmentRepository = new DepartmentRepository();
const departmentService = new DepartmentService(departmentRepository);
const departmentController = new DepartmentController(departmentService);

export { departmentController };