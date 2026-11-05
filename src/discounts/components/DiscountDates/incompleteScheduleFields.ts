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
