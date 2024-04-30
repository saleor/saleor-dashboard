import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { Tooltip } from "@saleor/macaw-ui-next";
import moment from "moment-timezone";
import React from "react";

import { LocaleConsumer } from "../Locale";
import { Consumer } from "./DateContext";

interface DateProps {
  date: string;
  plain?: boolean;
}

export const Date: React.FC<DateProps> = ({ date, plain }) => {
  const localizeDate = useDateLocalize();
  const getHumanized = (value: string, locale: string, currentDate: number) =>
    moment(value).locale(locale).from(currentDate);

  return (
    <LocaleConsumer>
      {({ locale }) => (
        <Consumer>
          {currentDate =>
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
        </Consumer>
      )}
    </LocaleConsumer>
  );
};
Date.displayName = "Date";
export default Date;
