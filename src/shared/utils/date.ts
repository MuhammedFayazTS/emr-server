import { addDays, addHours, addMinutes, subMinutes } from "date-fns";
import { DayOfWeek } from "../constants/days";

export const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export const thirtyDaysFromNow = (): Date => addDays(new Date(), 30);

export const fortyFiveMinutesFromNow = (): Date => addMinutes(new Date(), 45);

export const anHourFromNow = (): Date => addHours(new Date(), 1);

export const threeMinuteAgo = (): Date => subMinutes(new Date(), 3);

export const calculateExpirationDate = (expiresIn: string = "15m"): Date => {
  // Match number + unit (m = minutes, h = hours, d = days)
  const match = expiresIn.match(/^(\d+)([mhd])$/);
  if (!match) throw new Error('Invalid format. Use "15m", "1h", or "2d".');
  const [, value, unit] = match;

  const val = parseInt(value, 10);

  // Check the unit and apply accordingly
  switch (unit) {
    case "m": // minutes
      return addMinutes(new Date(), val);
    case "h": // hours
      return addHours(new Date(), val);
    case "d": // days
      return addDays(new Date(), val);
    default:
      throw new Error('Invalid unit. Use "m", "h", or "d".');
  }
};

export const getDayofDate = (date: Date) => {
  const dayNumber = date.getDay();
  const dayMap: Record<number, DayOfWeek> = {
    0: DayOfWeek.SUNDAY,
    1: DayOfWeek.MONDAY,
    2: DayOfWeek.TUESDAY,
    3: DayOfWeek.WEDNESDAY,
    4: DayOfWeek.THURSDAY,
    5: DayOfWeek.FRIDAY,
    6: DayOfWeek.SATURDAY,
  }

  return dayMap[dayNumber];
}

/**
 * Converts "HH:mm"(24hr) to minutes since midnight.
 * e.g. "09:30" -> 570
  */
export function timeToMinutes(time: string): number {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);

  if (!match) {
    throw new Error(`Invalid time format: "${time}". Expected HH:mm (24hr).`);
  }

  const [, hours, minutes] = match;
  return Number(hours) * 60 + Number(minutes);
}

/**
 * Converts minutes since midnight back to "HH:mm" (24hr).
 * e.g. 570 -> "09:30"
 */
export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}