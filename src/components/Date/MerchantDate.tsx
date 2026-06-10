import { useCurrentDate } from "@dashboard/hooks/useCurrentDate";
import { Text, Tooltip } from "@saleor/macaw-ui-next";
import { type IntlShape, type MessageDescriptor, useIntl } from "react-intl";

import { LocaleConsumer } from "../Locale";
import { TimezoneConsumer } from "../Timezone";
import { merchantDateMessages } from "./MerchantDate.messages";

// The kinds we plan to surface in merchant-facing UI. To add a new one, append
// the value to this union and a matching entry to `kindMessages` below; the
// type system will then force translators to provide a full bundle.
export type MerchantDateKind = "created" | "placed";

interface MerchantDateMessageBundle {
  justNow: MessageDescriptor;
  minutesAgo: MessageDescriptor;
  today: MessageDescriptor;
  yesterday: MessageDescriptor;
  thisYear: MessageDescriptor;
  on: MessageDescriptor;
}

const kindMessages: Record<MerchantDateKind, MerchantDateMessageBundle> = {
  created: {
    justNow: merchantDateMessages.createdJustNow,
    minutesAgo: merchantDateMessages.createdMinutesAgo,
    today: merchantDateMessages.createdToday,
    yesterday: merchantDateMessages.createdYesterday,
    thisYear: merchantDateMessages.createdThisYear,
    on: merchantDateMessages.createdOn,
  },
  placed: {
    justNow: merchantDateMessages.placedJustNow,
    minutesAgo: merchantDateMessages.placedMinutesAgo,
    today: merchantDateMessages.placedToday,
    yesterday: merchantDateMessages.placedYesterday,
    thisYear: merchantDateMessages.placedThisYear,
    on: merchantDateMessages.placedOn,
  },
};

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 60 * SECONDS_IN_MINUTE;
const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

const safeFormatDate = (
  date: Date,
  options: Intl.DateTimeFormatOptions,
  locale: string,
): string => {
  try {
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch {
    return date.toISOString();
  }
};

interface CalendarDateParts {
  day: number;
  month: number;
  year: number;
}

const getCalendarDateParts = (date: Date, tz?: string): CalendarDateParts => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    timeZone: tz,
    year: "numeric",
  };
  const parts = new Intl.DateTimeFormat("en", options).formatToParts(date);
  const getPart = (type: Intl.DateTimeFormatPartTypes): number =>
    Number(parts.find(part => part.type === type)?.value);

  return {
    day: getPart("day"),
    month: getPart("month"),
    year: getPart("year"),
  };
};

const datePartsToKey = ({ day, month, year }: CalendarDateParts): string =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const previousCalendarDayKey = ({ day, month, year }: CalendarDateParts): string => {
  const previousDay = new Date(Date.UTC(year, month - 1, day) - MILLISECONDS_IN_DAY);

  return datePartsToKey({
    day: previousDay.getUTCDate(),
    month: previousDay.getUTCMonth() + 1,
    year: previousDay.getUTCFullYear(),
  });
};

export interface MerchantDateResult {
  label: string;
  tooltip: string;
}

interface GetMerchantDateParams {
  date: string;
  intl: IntlShape;
  kind: MerchantDateKind;
  locale: string;
  tz?: string;
  /**
   * Reference timestamp used for the recency calculation. Defaults to "right
   * now" for ergonomics, but callers in render paths should pass a stable
   * value (e.g. from `useCurrentDate`) so the result is testable and bucket
   * transitions are predictable.
   */
  now?: Date;
}

/**
 * Pure formatter for the merchant date trigger label and tooltip text.
 * Extracted so we can unit-test bucket selection and tooltip composition
 * without rendering the React tree (mirrors `getRelativeDate` in
 * OrderHistoryDate).
 */
export const getMerchantDate = ({
  date,
  intl,
  kind,
  locale,
  tz,
  now = new Date(),
}: GetMerchantDateParams): MerchantDateResult => {
  const target = new Date(date);
  // Clamp negative diffs (clock skew or future-dated test data) to "just now"
  const diffSeconds = Math.max(0, Math.floor((now.getTime() - target.getTime()) / 1000));
  const m = kindMessages[kind];

  // The tooltip always carries a fully qualified timestamp with the timezone
  // name, regardless of which bucket the trigger label falls into. `timeStyle:
  // "long"` is what brings the timezone abbreviation (e.g. "CEST", "EST") so
  // the merchant can interpret the time without guessing.
  const tooltip = safeFormatDate(
    target,
    { dateStyle: "medium", timeStyle: "long", timeZone: tz },
    locale,
  );

  if (diffSeconds < SECONDS_IN_MINUTE) {
    return { label: intl.formatMessage(m.justNow), tooltip };
  }

  if (diffSeconds < SECONDS_IN_HOUR) {
    const minutes = Math.floor(diffSeconds / SECONDS_IN_MINUTE);

    return { label: intl.formatMessage(m.minutesAgo, { minutes }), tooltip };
  }

  const targetParts = getCalendarDateParts(target, tz);
  const nowParts = getCalendarDateParts(now, tz);
  const targetDay = datePartsToKey(targetParts);
  const todayDay = datePartsToKey(nowParts);
  const yesterdayDay = previousCalendarDayKey(nowParts);
  const time = safeFormatDate(target, { timeStyle: "short", timeZone: tz }, locale);

  if (targetDay === todayDay) {
    return { label: intl.formatMessage(m.today, { time }), tooltip };
  }

  if (targetDay === yesterdayDay) {
    return { label: intl.formatMessage(m.yesterday, { time }), tooltip };
  }

  if (targetParts.year === nowParts.year) {
    const formattedDate = safeFormatDate(
      target,
      { day: "numeric", month: "short", timeZone: tz },
      locale,
    );

    return { label: intl.formatMessage(m.thisYear, { date: formattedDate, time }), tooltip };
  }

  const formattedDate = safeFormatDate(target, { dateStyle: "medium", timeZone: tz }, locale);

  return { label: intl.formatMessage(m.on, { date: formattedDate }), tooltip };
};

interface MerchantDateProps {
  kind: MerchantDateKind;
  date: string;
  /**
   * Override the reference "now" date. Mainly useful for tests and storybook
   * so we can pin the recency bucket deterministically. In the regular render
   * path the component falls back to `useCurrentDate()` so the bucket label
   * advances over time without requiring callers to manage the clock.
   */
  now?: Date;
}

// TODO(perf): if we render many of these on a single page (e.g. an order list
// row date), each tick of `useCurrentDate` re-allocates a few Intl formatters.
// Worth introducing a memoized formatter cache keyed by (locale, options) at
// that point. Single-instance usage in headers is fine.
export const MerchantDate = ({ kind, date, now }: MerchantDateProps): JSX.Element => {
  const intl = useIntl();
  const liveNow = useCurrentDate();
  const referenceNow = now ?? new Date(liveNow);

  return (
    <TimezoneConsumer>
      {tz => (
        <LocaleConsumer>
          {({ locale }) => {
            const { label, tooltip } = getMerchantDate({
              date,
              intl,
              kind,
              locale,
              tz,
              now: referenceNow,
            });

            return (
              <Tooltip>
                <Tooltip.Trigger>
                  <Text
                    as="span"
                    size={3}
                    fontWeight="regular"
                    color="default2"
                    data-test-id={`merchant-date-${kind}`}
                  >
                    {label}
                  </Text>
                </Tooltip.Trigger>
                <Tooltip.Content side="bottom">
                  <Tooltip.Arrow />
                  {tooltip}
                </Tooltip.Content>
              </Tooltip>
            );
          }}
        </LocaleConsumer>
      )}
    </TimezoneConsumer>
  );
};

MerchantDate.displayName = "MerchantDate";
