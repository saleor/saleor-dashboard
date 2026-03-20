import { useCurrentDate } from "@dashboard/hooks/useCurrentDate";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { Tooltip } from "@saleor/macaw-ui-next";

import { LocaleConsumer } from "../Locale";
import { getRelativeTime } from "./getRelativeTime";

interface DateProps {
  date: string;
  plain?: boolean;
}

export const Date = ({ date, plain }: DateProps) => {
  const localizeDate = useDateLocalize();
  const currentDate = useCurrentDate();

  return (
    <LocaleConsumer>
      {({ locale }) =>
        plain ? (
          localizeDate(date)
        ) : (
          <Tooltip>
            <Tooltip.Trigger>
              <time dateTime={date} data-test-id="dateTime">
                {getRelativeTime(date, currentDate, locale)}
              </time>
            </Tooltip.Trigger>
            <Tooltip.Content side="bottom">
              <Tooltip.Arrow />
              {localizeDate(date)}
            </Tooltip.Content>
          </Tooltip>
        )
      }
    </LocaleConsumer>
  );
};

Date.displayName = "Date";
