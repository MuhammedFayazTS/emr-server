import { BadRequestError, NotFoundError } from "@/shared/errors/CommonExceptions";
import { getDayofDate, minutesToTime, timeToMinutes } from "@/shared/utils/date";

import type { ISlot } from "./slot.types";
import type AppointmentRepository from "@modules/appointment/appointment.repository";
import type { DoctorScheduleService } from "@modules/doctor-schedule";

class SlotService {
    private doctorScheduleService: DoctorScheduleService;
    private appointmentRepository: AppointmentRepository;

    constructor(
        doctorScheduleService: DoctorScheduleService,
        appointmentRepository: AppointmentRepository,
    ) {
        this.doctorScheduleService = doctorScheduleService;
        this.appointmentRepository = appointmentRepository;
    }

    async generateSlots(doctorId: string, date: Date): Promise<Record<string, ISlot[]>> {
        const schedule = await this.doctorScheduleService.getScheduleByDoctorId(doctorId);

        const { workingDays, slotDuration } = schedule;

        const day = getDayofDate(date);

        const targetWorkingDay = workingDays.find((wd) => wd.dayOfWeek === day);

        if (!targetWorkingDay) {
            throw new NotFoundError("No schedule found for this day");
        }

        if (!targetWorkingDay.isWorking) {
            throw new NotFoundError("Doctor is not working on this day");
        }

        // Load booked appointments
        const bookedAppointments = await this.appointmentRepository.findBookedSlotsByDoctorAndDate(
            doctorId,
            date,
        );

        // Fast lookup by slot start time
        const bookedSlots = new Set(bookedAppointments.map((appointment) => appointment.startTime));

        const sessionSlots: Record<string, ISlot[]> = {};

        for (const session of targetWorkingDay.sessions) {
            const { startTime, endTime, name } = session;

            const startMinutes = timeToMinutes(startTime);
            const endMinutes = timeToMinutes(endTime);

            if (endMinutes <= startMinutes) {
                throw new BadRequestError(
                    `Invalid session: end time (${endTime}) must be after start time (${startTime})`,
                );
            }

            const sessionKey = name;

            if (sessionSlots[sessionKey]) {
                throw new BadRequestError(`Duplicate session name/key found: "${sessionKey}"`);
            }

            const sessionLength = endMinutes - startMinutes;
            const numberOfSlots = Math.floor(sessionLength / slotDuration);

            const slots: ISlot[] = [];

            for (let i = 0; i < numberOfSlots; i++) {
                const slotStartMinutes = startMinutes + i * slotDuration;
                const slotEndMinutes = slotStartMinutes + slotDuration;

                const slotStartTime = minutesToTime(slotStartMinutes);
                const slotEndTime = minutesToTime(slotEndMinutes);

                slots.push({
                    startTime: slotStartTime,
                    endTime: slotEndTime,
                    date,
                    doctorId,
                    isBooked: bookedSlots.has(slotStartTime),
                });
            }

            sessionSlots[sessionKey] = slots;
        }

        return sessionSlots;
    }
}

export default SlotService;
