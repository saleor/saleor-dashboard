import { useCurrentDate } from "@dashboard/hooks/useCurrentDate";
import { Tooltip } from "@saleor/macaw-ui-next";

import { LocaleConsumer } from "../Locale";
import { TimezoneConsumer } from "../Timezone";
import { getRelativeTime } from "./getRelativeTime";

interface DateTimeProps {
  date: string;
  plain?: boolean;
}

const formatDateTime = (value: string, locale: string, tz?: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
    timeStyle: "short",
    ...(tz ? { timeZone: tz } : {}),
  };

  return new Intl.DateTimeFormat(locale, options).format(new Date(value));
};

export const DateTime = ({ date, plain }: DateTimeProps) => {
  const currentDate = useCurrentDate();

  return (
    <TimezoneConsumer>
      {tz => (
        <LocaleConsumer>
          {({ locale }) =>
            plain ? (
              formatDateTime(date, locale, tz)
            ) : (
              <Tooltip>
                <Tooltip.Trigger>
                  <div>{getRelativeTime(date, currentDate, locale)}</div>
                </Tooltip.Trigger>
                <Tooltip.Content side="bottom">
                  <Tooltip.Arrow />
                  {formatDateTime(date, locale, tz)}
                </Tooltip.Content>
              </Tooltip>
            )
          }
        </LocaleConsumer>
      )}
    </TimezoneConsumer>
  );
};
DateTime.displayName = "DateTime";
