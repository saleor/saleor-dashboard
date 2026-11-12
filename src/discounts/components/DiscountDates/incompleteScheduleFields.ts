export const SCHEDULE_DATE_FIELDS = ["startDate", "startTime", "endDate", "endTime"] as const;

export type ScheduleDateField = (typeof SCHEDULE_DATE_FIELDS)[number];

export const END_SCHEDULE_DATE_FIELDS: readonly ScheduleDateField[] = ["endDate", "endTime"];

const isScheduleDateField = (name: string): name is ScheduleDateField =>
  SCHEDULE_DATE_FIELDS.some(field => field === name);

/**
 * The incomplete fields after a date or time input changes or loses focus, or `null` when nothing
 * changed. A native date or time input reports an empty value while only some of its segments are
 * filled in; `validity.badInput` is what tells that apart from an empty input.
 */
export const getNextIncompleteScheduleFields = (
  current: readonly ScheduleDateField[],
  { name, validity }: { name: string; validity: Pick<ValidityState, "badInput"> },
): ScheduleDateField[] | null => {
  if (!isScheduleDateField(name)) {
    return null;
  }

  const isIncomplete = validity.badInput;

  if (current.includes(name) === isIncomplete) {
    return null;
  }

  return isIncomplete ? [...current, name] : current.filter(field => field !== name);
};

// A year below 1000, such as 0202-07-01: the date input already reports a value while the year
// is still being typed.
const SHORT_YEAR = /^0\d{3}-/;
const DATE_FIELDS = ["startDate", "endDate"] as const;

/**
 * Schedule fields that hold something other than what the merchant meant to enter: inputs that
 * are only partly typed (they report an empty value) and dates whose year is still being typed.
 * End fields don't count while the end date is off, since they are not sent.
 */
export const getUnfinishedScheduleFields = (
  data: Partial<Record<ScheduleDateField, string>> & { hasEndDate?: boolean },
  incompleteFields: readonly ScheduleDateField[] = [],
): ScheduleDateField[] => {
  const isSent = (field: ScheduleDateField): boolean =>
    !!data.hasEndDate || !END_SCHEDULE_DATE_FIELDS.includes(field);
  const partlyTyped = incompleteFields.filter(field => !data[field] && isSent(field));
  const shortYears = DATE_FIELDS.filter(
    field => SHORT_YEAR.test(data[field] ?? "") && isSent(field) && !partlyTyped.includes(field),
  );

  return [...partlyTyped, ...shortYears];
};
