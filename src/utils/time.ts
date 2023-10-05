export function convertToTimezoneLocalTime(
  time: number,
  timezoneOffset: number
) {
  const unixTimeInMilliseconds = time * 1000;
  const offsetInMilliseconds = timezoneOffset * 1000;
  const localTimeInMilliseconds = unixTimeInMilliseconds + offsetInMilliseconds;
  const date = new Date(localTimeInMilliseconds);

  return date;
}

export function getCurrentTimeInTimeZone(timezoneOffset: number) {
  const currentTime = new Date();
  const localOffset = currentTime.getTimezoneOffset() * 60000;

  const targetOffset = timezoneOffset * 1000;
  const targetTime = currentTime.getTime() + localOffset + targetOffset;

  const dateInTargetTimezone = new Date(targetTime);

  return dateInTargetTimezone;
}

export function formatToTimezoneString(date: Date, timeZone = "UTC"): string {
  const option: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "numeric",
  };

  if (timeZone) {
    option["timeZone"] = timeZone;
  }

  const formattedDate = date.toLocaleString(undefined, option);

  const hours = date.getHours();
  const suffix = hours > 11 ? " PM" : " AM";

  return formattedDate + suffix;
}

export function formatHoursTo12(date: Date) {
  const hours = date.getHours();
  const suffix = hours > 11 ? "PM" : "AM";
  return `${hours % 12 || 12}${suffix}`;
}

export function getHourDifference(date1: Date, date2: Date) {
  const diffInMilliseconds = date2.getTime() - date1.getTime();
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  return diffInHours;
}

export function getDayName(d: Date) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekday[d.getDay()];
}

export function getDifferenceInMinutes(date1: Date, date2: Date) {
  const diffInMilliseconds = date2.getTime() - date1.getTime();
  const diffInMins = Math.ceil(diffInMilliseconds / (1000 * 60));
  return diffInMins;
}
