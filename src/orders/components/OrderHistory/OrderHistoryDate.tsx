// @ts-strict-ignore
import { TimezoneConsumer } from "@dashboard/components/Timezone";
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
  tz?: string,
  now = new Date(),
): RelativeDateResult => {
  const eventDate = new Date(date);
  const diffInSeconds = (now.getTime() - eventDate.getTime()) / 1000;

  let dateStr: string;

  if (diffInSeconds < 60) {
    dateStr = intl.formatMessage({
      id: "wOaLvi",
      defaultMessage: "just now",
      description: "relative time",
    });
  } else {
    dateStr = intl.formatRelativeTime(Math.floor(-diffInSeconds), "second", {
      numeric: "auto",
      style: "narrow",
    });

    if (diffInSeconds >= 60) {
      dateStr = intl.formatRelativeTime(Math.floor(-diffInSeconds / 60), "minute", {
        numeric: "auto",
        style: "narrow",
      });
    }

    if (diffInSeconds >= 3600) {
      dateStr = intl.formatRelativeTime(Math.floor(-diffInSeconds / 3600), "hour", {
        numeric: "auto",
        style: "narrow",
      });
    }

    if (diffInSeconds >= 86400) {
      dateStr = intl.formatRelativeTime(Math.floor(-diffInSeconds / 86400), "day", {
        numeric: "auto",
        style: "narrow",
      });
    }

    if (diffInSeconds >= 604800) {
      dateStr = intl.formatDate(date, {
        dateStyle: "medium",
        timeZone: tz,
      });
    }
  }

  const fullDate = intl.formatDate(date, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: tz,
    timeZoneName: "short",
  });

  return { dateStr, fullDate };
};

export const OrderHistoryDate = ({ date }: OrderHistoryDateProps) => {
  const intl = useIntl();

  return (
    <TimezoneConsumer>
      {tz => {
        const { dateStr, fullDate } = getRelativeDate(date, intl, tz);

        return (
          <span title={fullDate} style={{ cursor: "default" }}>
            {dateStr}
          </span>
        );
      }}
    </TimezoneConsumer>
  );
};
