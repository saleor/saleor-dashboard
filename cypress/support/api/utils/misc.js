import moment from "moment-timezone";

export function getDatePeriod(days) {
  if (days < 1) {
    return {};
  }

  const end = moment().startOf("day");
  const start = end.subtract(days - 1);
  const format = "YYYY-MM-DD";

  return {
    gte: start.format(format),
    lte: end.format(format)
  };
}
