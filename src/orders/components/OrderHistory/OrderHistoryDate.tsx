import { LocaleConsumer } from "@dashboard/components/Locale";
import { TimezoneConsumer } from "@dashboard/components/Timezone";
import moment from "moment-timezone";
import { IntlShape, useIntl } from "react-intl";

interface OrderHistoryDateProps {
  date: string;
}

export interface RelativeDateResult {
  dateStr: string;
  fullDate: string;
}

/**
 * Calculate relative date string and full date for tooltip.
 * Extracted for testability.
 */
export const getRelativeDate = (
  date: string,
  intl: IntlShape,
  locale: string,
  tz?: string,
  now?: moment.Moment,
): RelativeDateResult => {
  const m = moment(date).locale(locale);

  if (tz) {
    m.tz(tz);
  }

  const currentMoment = now ? now.clone().locale(locale) : moment().locale(locale);

  if (tz && !now) {
    currentMoment.tz(tz);
  }

  // Relative time display (e.g., "1h ago", "2d ago")
  const diffMinutes = currentMoment.diff(m, "minutes");
  const diffHours = currentMoment.diff(m, "hours");
  const diffDays = currentMoment.diff(m, "days");

  let dateStr: string;

  if (diffMinutes < 1) {
    dateStr = intl.formatMessage({
      id: "wOaLvi",
      defaultMessage: "just now",
      description: "relative time",
    });
  } else if (diffMinutes < 60) {
    dateStr = intl.formatMessage(
      {
        id: "cIoOf0",
        defaultMessage: "{minutes}m ago",
        description: "relative time in minutes",
      },
      { minutes: diffMinutes },
    );
  } else if (diffHours < 24) {
    dateStr = intl.formatMessage(
      {
        id: "puYVLm",
        defaultMessage: "{hours}h ago",
        description: "relative time in hours",
      },
      { hours: diffHours },
    );
  } else if (diffDays < 7) {
    dateStr = intl.formatMessage(
      {
        id: "pSFOFy",
        defaultMessage: "{days}d ago",
        description: "relative time in days",
      },
      { days: diffDays },
    );
  } else {
    dateStr = m.format("MMM D, YYYY");
  }

  // Full date with GMT for tooltip
  const offset = m.format("Z");
  const shortOffset = offset.endsWith(":00") ? offset.slice(0, -3) : offset;
  const fullDate = `${m.format("MMM D, YYYY, h:mm A")} GMT${shortOffset}`;

  return { dateStr, fullDate };
};

export const OrderHistoryDate = ({ date }: OrderHistoryDateProps) => {
  const intl = useIntl();

  return (
    <TimezoneConsumer>
      {tz => (
        <LocaleConsumer>
          {({ locale }) => {
            const { dateStr, fullDate } = getRelativeDate(date, intl, locale, tz);

            return (
              <span title={fullDate} style={{ cursor: "default" }}>
                {dateStr}
              </span>
            );
          }}
        </LocaleConsumer>
      )}
    </TimezoneConsumer>
  );
};
