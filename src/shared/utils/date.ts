import { addDays, addHours, addMinutes, subMinutes } from "date-fns";

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