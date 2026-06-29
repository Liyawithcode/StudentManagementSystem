export const convertToTimezone = (date, timezone = "UTC") => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;

  try {
    return new Date(d.toLocaleString("en-US", { timeZone: timezone }));
  } catch (error) {
    console.error("Invalid timezone:", timezone);
    return d;
  }
};

export const getCurrentTimeInTimezone = (timezone = "UTC") => {
  return convertToTimezone(new Date(), timezone);
};

export default {
  convertToTimezone,
  getCurrentTimeInTimezone
};
