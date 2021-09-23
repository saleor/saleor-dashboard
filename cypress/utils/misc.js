import moment from "moment-timezone";

const format = "YYYY-MM-DD";

export function getDatePeriod(days) {
  if (days < 1) {
    return {};
  }

  const end = moment().startOf("day");
  const start = end.subtract(days - 1);

  return {
    gte: start.format(format),
    lte: end.format(format)
  };
}

export function addToDate(date, amount, periodType) {
  const currentDate = moment(date);
  const futureDate = moment(currentDate).add(amount, periodType);
  return futureDate.format(format);
}
