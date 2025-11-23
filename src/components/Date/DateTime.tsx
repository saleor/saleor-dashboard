import { Tooltip } from "@saleor/macaw-ui-next";
import moment from "moment-timezone";
import ReactMoment from "react-moment";

import { LocaleConsumer } from "../Locale";
import { TimezoneConsumer } from "../Timezone";
import { Consumer } from "./DateContext";

interface DateTimeProps {
  date: string;
  plain?: boolean;
}

export const DateTime = ({ date, plain }: DateTimeProps) => {
  const getTitle = (value: string, locale?: string, tz?: string) => {
    let dateObj = locale ? moment(value).locale(locale) : moment(value);

    if (tz !== undefined) {
      dateObj = dateObj.tz(tz);
    }

    return dateObj.format("lll");
  };

  return (
    <TimezoneConsumer>
      {tz => (
        <LocaleConsumer>
          {({ locale }) => (
            <Consumer>
              {currentDate =>
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
            </Consumer>
          )}
        </LocaleConsumer>
      )}
    </TimezoneConsumer>
  );
};
DateTime.displayName = "DateTime";
export default DateTime;
