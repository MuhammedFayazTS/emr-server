import DepartmentController from "@/modules/department/department.controller";
import DepartmentRepository from "@/modules/department/department.repository";
import DepartmentService from "@/modules/department/department.service";

const departmentRepository = new DepartmentRepository();
const departmentService = new DepartmentService(departmentRepository);
const departmentController = new DepartmentController(departmentService);

export { departmentController, departmentService };
