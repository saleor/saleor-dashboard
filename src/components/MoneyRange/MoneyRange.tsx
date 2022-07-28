import React from "react";
import { useIntl } from "react-intl";

import { LocaleConsumer } from "../Locale";
import { formatMoney, IMoney } from "../Money";

export interface MoneyRangeProps {
  from?: IMoney;
  to?: IMoney;
}

export const MoneyRange: React.FC<MoneyRangeProps> = ({ from, to }) => {
  const intl = useIntl();

  return (
    <LocaleConsumer>
      {({ locale }) =>
        from && to
          ? intl.formatMessage(
              {
                id: "zTdwWM",
                defaultMessage: "{fromMoney} - {toMoney}",
                description: "money",
              },
              {
                fromMoney: formatMoney(from, locale),
                toMoney: formatMoney(to, locale),
              },
            )
          : from && !to
          ? intl.formatMessage(
              {
                id: "lW5uJO",
                defaultMessage: "from {money}",
                description: "money",
              },
              {
                money: formatMoney(from, locale),
              },
            )
          : !from && to
          ? intl.formatMessage(
              {
                id: "hptDxW",
                defaultMessage: "to {money}",
                description: "money",
              },
              {
                money: formatMoney(to, locale),
              },
            )
          : "-"
      }
    </LocaleConsumer>
  );
};

MoneyRange.displayName = "MoneyRange";
export default MoneyRange;
