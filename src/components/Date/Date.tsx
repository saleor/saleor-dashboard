import { useCurrentDate } from "@dashboard/hooks/useCurrentDate";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { Tooltip } from "@saleor/macaw-ui-next";
import moment from "moment-timezone";

import { LocaleConsumer } from "../Locale";

interface DateProps {
  date: string;
  plain?: boolean;
}

export const Date = ({ date, plain }: DateProps) => {
  const localizeDate = useDateLocalize();
  const getHumanized = (value: string, locale: string, currentDate: number) =>
    moment(value).locale(locale).from(currentDate);
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
                {getHumanized(date, locale, currentDate)}
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
