import { TimezoneConsumer } from "@dashboard/components/Timezone";
import { Text, Tooltip } from "@saleor/macaw-ui-next";
import { IntlShape, useIntl } from "react-intl";

interface OrderHistoryDateProps {
  date: string;
}

export interface RelativeDateResult {
  dateStr: string;
  fullDate: string;
}

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

/**
 * Format date for display using Intl.DateTimeFormat.
 * Falls back to ISO string if formatting fails.
 */
const formatDate = (date: Date, options: Intl.DateTimeFormatOptions, locale: string): string => {
  try {
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch {
    return date.toISOString();
  }
};

interface GetRelativeDateParams {
  date: string;
  intl: IntlShape;
  tz?: string;
  now?: Date;
}

/**
 * Calculate relative date string and full date for tooltip.
 * Extracted for testability.
 */
export const getRelativeDate = ({
  date,
  intl,
  tz,
  now = new Date(),
}: GetRelativeDateParams): RelativeDateResult => {
  const eventDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - eventDate.getTime()) / 1000);

  let dateStr: string;

  if (diffInSeconds < MINUTE) {
    dateStr = intl.formatMessage({
      id: "wOaLvi",
      defaultMessage: "just now",
      description: "relative time",
    });
  } else if (diffInSeconds < HOUR) {
    const minutes = Math.floor(diffInSeconds / MINUTE);

    dateStr = intl.formatMessage(
      {
        id: "cIoOf0",
        defaultMessage: "{minutes}m ago",
        description: "relative time in minutes",
      },
      { minutes },
    );
  } else if (diffInSeconds < DAY) {
    const hours = Math.floor(diffInSeconds / HOUR);

    dateStr = intl.formatMessage(
      {
        id: "puYVLm",
        defaultMessage: "{hours}h ago",
        description: "relative time in hours",
      },
      { hours },
    );
  } else if (diffInSeconds < WEEK) {
    const days = Math.floor(diffInSeconds / DAY);

    dateStr = intl.formatMessage(
      {
        id: "pSFOFy",
        defaultMessage: "{days}d ago",
        description: "relative time in days",
      },
      { days },
    );
  } else {
    dateStr = formatDate(eventDate, { dateStyle: "medium", timeZone: tz }, intl.locale);
  }

  const fullDate = formatDate(
    eventDate,
    {
      dateStyle: "medium",
      timeStyle: "long",
      timeZone: tz,
    },
    intl.locale,
  );

  return { dateStr, fullDate };
};

export const OrderHistoryDate = ({ date }: OrderHistoryDateProps) => {
  const intl = useIntl();

  return (
    <TimezoneConsumer>
      {tz => {
        const { dateStr, fullDate } = getRelativeDate({ date, intl, tz });

        return (
          <Tooltip>
            <Tooltip.Trigger>
              <Text size={2} color="default2">
                {dateStr}
              </Text>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Tooltip.Arrow />
              <Text size={2}>{fullDate}</Text>
            </Tooltip.Content>
          </Tooltip>
        );
      }}
    </TimezoneConsumer>
  );
};
