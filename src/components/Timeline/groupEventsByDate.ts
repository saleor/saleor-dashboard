export type TimelineDateGroupKey =
  | "TODAY"
  | "YESTERDAY"
  | "LAST_7_DAYS"
  | "LAST_30_DAYS"
  | "OLDER"
  | "UNKNOWN";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const startOfDay = (date: Date): Date => {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
};

/**
 * Whole local calendar days between `from` and `to` (to ≥ from).
 * Avoids splitting one calendar day across buckets when using elapsed hours.
 */
const calendarDaysBetween = (from: Date, to: Date): number =>
  Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / MS_PER_DAY);

/** Smart grouping key based on calendar-day age. */
export const getDateGroupKey = (date: string | null | undefined): TimelineDateGroupKey => {
  if (!date) {
    return "UNKNOWN";
  }

  const eventDate = new Date(date);

  if (Number.isNaN(eventDate.getTime())) {
    return "UNKNOWN";
  }

  const currentDate = new Date();
  const daysAgo = calendarDaysBetween(eventDate, currentDate);

  if (daysAgo <= 0) {
    return "TODAY";
  }

  if (daysAgo === 1) {
    return "YESTERDAY";
  }

  if (daysAgo < 7) {
    return "LAST_7_DAYS";
  }

  if (daysAgo < 30) {
    return "LAST_30_DAYS";
  }

  return "OLDER";
};

interface DatedEvent {
  date?: string | null;
}

/** Group events by date bucket — preserves insertion order of groups and items. */
export const groupEventsByDate = <T extends DatedEvent>(
  events: T[],
): Array<[TimelineDateGroupKey, T[]]> => {
  const groups: Array<[TimelineDateGroupKey, T[]]> = [];
  const groupMap = new Map<TimelineDateGroupKey, number>();

  events.forEach(event => {
    const key = getDateGroupKey(event.date);

    if (!groupMap.has(key)) {
      groupMap.set(key, groups.length);
      groups.push([key, []]);
    }

    const index = groupMap.get(key)!;

    groups[index][1].push(event);
  });

  return groups;
};
