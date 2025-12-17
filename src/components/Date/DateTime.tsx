// @ts-strict-ignore
import { useCurrentDate } from "@dashboard/hooks/useCurrentDate";
import { Tooltip } from "@saleor/macaw-ui-next";
import moment from "moment-timezone";
import ReactMoment from "react-moment";

import { LocaleConsumer } from "../Locale";
import { TimezoneConsumer } from "../Timezone";

interface DateTimeProps {
  date: string;
  plain?: boolean;
}

export const DateTime = ({ date, plain }: DateTimeProps) => {
  const currentDate = useCurrentDate();

  const getTitle = (value: string, locale?: string, tz?: string) => {
    let date = moment(value).locale(locale);

    if (tz !== undefined) {
      date = date.tz(tz);
    }

    return date.format("lll");
  };

  return (
    <TimezoneConsumer>
      {tz => (
        <LocaleConsumer>
          {({ locale }) =>
            plain ? (
              getTitle(date, locale, tz)
            ) : (
              <Tooltip>
                <Tooltip.Trigger>
                  <div>
                    <ReactMoment from={currentDate} locale={locale} tz={tz}>
                      {date}
                    </ReactMoment>
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Content side="bottom">
                  <Tooltip.Arrow />
                  {getTitle(date, locale, tz)}
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
