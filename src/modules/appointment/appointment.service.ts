import { Types } from "mongoose";

import { BadRequestError, ConflictError, NotFoundError } from "@/shared/errors/CommonExceptions";

import { toAppointmentResponseDto } from "./appointment.mapper";
import { AppointmentStatus } from "./appointment.types";

import type {
    AppointmentResponseDto,
    CancelAppointmentDto,
    CreateAppointmentDto,
    RescheduleAppointmentDto,
    SearchAppointmentQuery,
    UpdateAppointmentDto,
} from "./appointment.types";
import type { DoctorService } from "../doctor";
import type { PatientService } from "../patient";
import type AppointmentRepository from "./appointment.repository";
import type DepartmentService from "../department/department.service";
import type SlotService from "@modules/slot/slot.service";

class AppointmentService {
    private appoinmentRepository: AppointmentRepository;
    private doctorService: DoctorService;
    private departmentService: DepartmentService;
    private patientService: PatientService;
    private slotService: SlotService;

    constructor(
        appoinmentRepository: AppointmentRepository,
        doctorService: DoctorService,
        departmentService: DepartmentService,
        patientService: PatientService,
        slotService: SlotService,
    ) {
        this.appoinmentRepository = appoinmentRepository;
        this.doctorService = doctorService;
        this.departmentService = departmentService;
        this.patientService = patientService;
        this.slotService = slotService;
    }

    async createAppointment(data: CreateAppointmentDto): Promise<AppointmentResponseDto> {
        //  Validate patient exists and is active
        const patient = await this.patientService.getPatientById(data.patientId);
        if (!patient.isActive) throw new BadRequestError("Patient account is inactive");

        //  Validate doctor exists and is active
        const doctor = await this.doctorService.getDoctorById(data.doctorId);
        if (!doctor) throw new NotFoundError("Doctor not found");
        if (!doctor.isActive) throw new BadRequestError("Doctor account is inactive");

        //  Validate department exists
        const department = await this.departmentService.findById(data.departmentId);
        if (!department) throw new NotFoundError("Department not found");

        //  Parse date
        const appointmentDate = new Date(`${data.date}T00:00:00.000Z`);

        //  Verify slot is not in the past
        const now = new Date();
        if (appointmentDate < new Date(now.toISOString().split("T")[0] + "T00:00:00.000Z")) {
            throw new BadRequestError("Cannot book an appointment in the past");
        }

        //  Verify slot exists in the doctor's schedule
        const sessionSlots = await this.slotService.generateSlots(data.doctorId, appointmentDate);
        const allSlots = Object.values(sessionSlots).flat();
        const slotExists = allSlots.some(
            (slot) => slot.startTime === data.startTime && slot.endTime === data.endTime,
        );
        if (!slotExists) {
            throw new BadRequestError("Selected time slot does not exist in the doctor's schedule");
        }

        //  Verify slot is not already booked
        const isBooked = await this.appoinmentRepository.existsByDoctorAndSlot(
            data.doctorId,
            appointmentDate,
            data.startTime,
        );
        if (isBooked) {
            throw new ConflictError("This time slot is already booked");
        }

        //  Generate appointment number
        const parsedDate = new Date(data.date);
        parsedDate.setUTCHours(0, 0, 0, 0);

        const appointmentNumber = await this.generateAppointmentNumber(data.doctorId, parsedDate);

        //  Create appointment
        const appointment = await this.appoinmentRepository.create({
            ...data,
            appointmentNumber,
            date: appointmentDate,
            patientId: new Types.ObjectId(data.patientId),
            doctorId: new Types.ObjectId(data.doctorId),
            departmentId: new Types.ObjectId(data.departmentId),
            status: AppointmentStatus.SCHEDULED,
        });

        return toAppointmentResponseDto(appointment);
    }

    // ---- Update (notes, purpose only) ----
    async updateAppointment(
        id: string,
        data: UpdateAppointmentDto,
    ): Promise<AppointmentResponseDto> {
        const existing = await this.appoinmentRepository.findById(id);
        if (!existing) throw new NotFoundError("Appointment not found");

        if (existing.status === AppointmentStatus.CANCELLED) {
            throw new BadRequestError("Cannot update a cancelled appointment");
        }

        if (existing.status === AppointmentStatus.COMPLETED) {
            throw new BadRequestError("Cannot update a completed appointment");
        }

        const appointment = await this.appoinmentRepository.update(id, data);
        if (!appointment) throw new NotFoundError("Appointment not found");
        return toAppointmentResponseDto(appointment);
    }

    async cancelAppointment(
        id: string,
        cancelledBy: string,
        data: CancelAppointmentDto,
    ): Promise<AppointmentResponseDto> {
        const existing = await this.appoinmentRepository.findById(id);
        if (!existing) throw new NotFoundError("Appointment not found");

        if (existing.status === AppointmentStatus.CANCELLED) {
            throw new BadRequestError("Appointment is already cancelled");
        }

        if (existing.status === AppointmentStatus.COMPLETED) {
            throw new BadRequestError("Cannot cancel a completed appointment");
        }

        const appointment = await this.appoinmentRepository.cancel(
            id,
            cancelledBy,
            data.cancelReason,
        );
        if (!appointment) throw new NotFoundError("Appointment not found");

        // TODO: AuditService.log("appointment:cancel", { appointmentId: id, cancelledBy, reason: data.cancelReason })

        return toAppointmentResponseDto(appointment);
    }

    // ---- Arrive ----
    async arriveAppointment(id: string): Promise<AppointmentResponseDto> {
        const existing = await this.appoinmentRepository.findById(id);
        if (!existing) throw new NotFoundError("Appointment not found");

        if (existing.status !== AppointmentStatus.SCHEDULED) {
            throw new BadRequestError(`Cannot mark as arrived. Current status: ${existing.status}`);
        }

        const appointment = await this.appoinmentRepository.markArrived(id);
        if (!appointment) throw new NotFoundError("Appointment not found");
        return toAppointmentResponseDto(appointment);
    }

    // ---- In Progress ----
    async startAppointment(id: string): Promise<AppointmentResponseDto> {
        const existing = await this.appoinmentRepository.findById(id);
        if (!existing) throw new NotFoundError("Appointment not found");

        if (existing.status !== AppointmentStatus.ARRIVED) {
            throw new BadRequestError(
                `Cannot start appointment. Current status: ${existing.status}`,
            );
        }

        const appointment = await this.appoinmentRepository.markInProgress(id);
        if (!appointment) throw new NotFoundError("Appointment not found");
        return toAppointmentResponseDto(appointment);
    }

    // ---- Complete ----
    async completeAppointment(id: string): Promise<AppointmentResponseDto> {
        const existing = await this.appoinmentRepository.findById(id);
        if (!existing) throw new NotFoundError("Appointment not found");

        if (
            existing.status !== AppointmentStatus.ARRIVED &&
            existing.status !== AppointmentStatus.IN_PROGRESS
        ) {
            throw new BadRequestError(
                `Cannot complete appointment. Current status: ${existing.status}`,
            );
        }

        const appointment = await this.appoinmentRepository.markCompleted(id);
        if (!appointment) throw new NotFoundError("Appointment not found");
        return toAppointmentResponseDto(appointment);
    }

    // ---- Reschedule ----
    async rescheduleAppointment(
        id: string,
        data: RescheduleAppointmentDto,
    ): Promise<AppointmentResponseDto> {
        const existing = await this.appoinmentRepository.findById(id);
        if (!existing) throw new NotFoundError("Appointment not found");

        if (existing.status === AppointmentStatus.CANCELLED) {
            throw new BadRequestError("Cannot reschedule a cancelled appointment");
        }

        if (existing.status === AppointmentStatus.COMPLETED) {
            throw new BadRequestError("Cannot reschedule a completed appointment");
        }

        const newDate = new Date(`${data.date}T00:00:00.000Z`);

        // Verify slot is not in the past
        const now = new Date();
        if (newDate < new Date(now.toISOString().split("T")[0] + "T00:00:00.000Z")) {
            throw new BadRequestError("Cannot reschedule to a past date");
        }

        // Verify new slot exists
        const sessionSlots = await this.slotService.generateSlots(
            existing.doctorId.toString(),
            newDate,
        );
        const allSlots = Object.values(sessionSlots).flat();
        const slotExists = allSlots.some(
            (slot) => slot.startTime === data.startTime && slot.endTime === data.endTime,
        );
        if (!slotExists) {
            throw new BadRequestError("Selected time slot does not exist in the doctor's schedule");
        }

        // Verify new slot is available
        const isBooked = await this.appoinmentRepository.existsByDoctorAndSlot(
            existing.doctorId.toString(),
            newDate,
            data.startTime,
        );
        if (isBooked) {
            throw new ConflictError("The new time slot is already booked");
        }

        const appointment = await this.appoinmentRepository.update(id, {
            date: newDate,
            startTime: data.startTime,
            endTime: data.endTime,
            status: AppointmentStatus.SCHEDULED,
        });
        if (!appointment) throw new NotFoundError("Appointment not found");

        // TODO: AuditService.log("appointment:reschedule", { appointmentId: id, oldDate, newDate, ... })

        return toAppointmentResponseDto(appointment);
    }

    // ---- get all with Search ----
    async getAllAppointments(query: SearchAppointmentQuery) {
        const result = await this.appoinmentRepository.findAll(query);
        return {
            data: result.data.map(toAppointmentResponseDto),
            pagination: result.pagination,
        };
    }

    // ---- Get By Id ----
    async getAppointmentById(id: string): Promise<AppointmentResponseDto> {
        const appointment = await this.appoinmentRepository.findById(id);
        if (!appointment) throw new NotFoundError("Appointment not found");
        return toAppointmentResponseDto(appointment);
    }

    // ---- Helpers ----
    private async generateAppointmentNumber(doctorId: string, date: Date): Promise<string> {
        const datePrefix = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD

        // NOTE: count-based approach has a race condition under concurrent bookings —
        // two simultaneous requests could read the same count before either writes,
        // producing duplicate sequence numbers. Fine for low-concurrency/demo use;
        // TODO: replace with an atomic Counter/sequence collection for production correctness.
        const count = await this.appoinmentRepository.countByDoctorAndDate(doctorId, date);
        const seq = String(count + 1).padStart(3, "0");

        return `APT-${doctorId.slice(-4)}-${datePrefix}-${seq}`;
    }
}

export default AppointmentService;
