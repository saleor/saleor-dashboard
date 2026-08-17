/** HTML date input value (YYYY-MM-DD) one day after start — keeps the picker near start. */
export const getDefaultEndDateAfterStart = (startDate: string): string => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    return "";
  }

  const [year, month, day] = startDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  date.setUTCDate(date.getUTCDate() + 1);

  return date.toISOString().slice(0, 10);
};
