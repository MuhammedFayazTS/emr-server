import ReceptionistController from "./receptionist.controller";
import ReceptionistRepository from "./receptionist.repository";
import ReceptionistService from "./receptionist.service";

const receptionistRepository = new ReceptionistRepository();
const receptionistService = new ReceptionistService(receptionistRepository);
const receptionistController = new ReceptionistController(receptionistService);

export {
    receptionistRepository,
    receptionistService,
    receptionistController,
    ReceptionistRepository,
    ReceptionistService,
};
