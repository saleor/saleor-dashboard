import { Tooltip } from "@material-ui/core";
import moment from "moment-timezone";
import React from "react";
import ReactMoment from "react-moment";

import { LocaleConsumer } from "../Locale";
import { TimezoneConsumer } from "../Timezone";
import { Consumer } from "./DateContext";
import { useStyles } from "./styles";

interface DateTimeProps {
  date: string;
  plain?: boolean;
}

export const DateTime: React.FC<DateTimeProps> = ({ date, plain }) => {
  const classes = useStyles();

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
          {({ locale }) => (
            <Consumer>
              {currentDate =>
                plain ? (
                  getTitle(date, locale, tz)
                ) : (
                  <Tooltip
                    title={getTitle(date, locale, tz)}
                    PopperProps={{
                      className: classes.tooltip,
                    }}
                  >
                    <ReactMoment from={currentDate} locale={locale} tz={tz}>
                      {date}
                    </ReactMoment>
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
