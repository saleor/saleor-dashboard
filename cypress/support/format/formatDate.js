export function formatDate(date) {
  const day = getPeriodValue(date, { day: "2-digit" });
  const month = getPeriodValue(date, { month: "2-digit" });
  const year = getPeriodValue(date, { year: "numeric" });

  return new Array(year, month, day).join("-");
}

function getPeriodValue(date, option) {
  const formatter = new Intl.DateTimeFormat("en-us", option);
  return formatter.format(date);
}
