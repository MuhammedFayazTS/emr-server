import { BadRequestError, NotFoundError } from "@/shared/errors/CommonExceptions";
import { getDayofDate, minutesToTime, timeToMinutes } from "@/shared/utils/date";
import { DoctorScheduleService } from "@modules/doctor-schedule";
import { ISlot } from "./slot.types";

class SlotService {
    private doctorScheduleService: DoctorScheduleService;

    constructor(doctorScheduleService: DoctorScheduleService) {
        this.doctorScheduleService = doctorScheduleService;
    }

    async generateSlots(doctorId: string, date: Date): Promise<Record<string, ISlot[]>> {
        const schedule = await this.doctorScheduleService.getScheduleByDoctorId(doctorId);
        if (!schedule) throw new NotFoundError("Schedule not found for the doctor");

        const { workingDays, slotDuration } = schedule;

        const day = getDayofDate(date);

        const targetWorkingDay = workingDays.find((wd) => wd.dayOfWeek === day);

        if (!targetWorkingDay) throw new NotFoundError("No schedule found for this day");
        if (!targetWorkingDay.isWorking) throw new NotFoundError("Doctor is not working on this day");

        const sessions = targetWorkingDay.sessions;

        const sessionSlots: Record<string, ISlot[]> = {};

        for (const session of sessions) {
            const { startTime, endTime, name } = session;

            const startMinutes = timeToMinutes(startTime);
            const endMinutes = timeToMinutes(endTime);

            if (endMinutes <= startMinutes) {
                throw new BadRequestError(
                    `Invalid session: end time (${endTime}) must be after start time (${startTime})`
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

                slots.push({
                    startTime: minutesToTime(slotStartMinutes),
                    endTime: minutesToTime(slotEndMinutes),
                    date,
                    doctorId,
                    isBooked: false,
                });
            }

            sessionSlots[sessionKey] = slots;
        }

        return sessionSlots;
    }
}

export default SlotService