import React from "react";
import { useIntl } from "react-intl";

import { LocaleConsumer } from "../Locale";
import { formatMoney, formatMoneyRange, IMoney } from "../Money";

export interface MoneyRangeProps {
  from?: IMoney;
  to?: IMoney;
}

export const MoneyRange: React.FC<MoneyRangeProps> = ({ from, to }) => {
  const intl = useIntl();

  return (
    <LocaleConsumer>
      {({ locale }) => {
        if (from && to) {
          return from.amount === to.amount
            ? formatMoney(from, locale)
            : formatMoneyRange(from, to, locale);
        }
        if (from && !to) {
          return intl.formatMessage(
            {
              id: "lW5uJO",
              defaultMessage: "from {money}",
              description: "money",
            },
            {
              money: formatMoney(from, locale),
            },
          );
        }
        if (!from && to) {
          return intl.formatMessage(
            {
              id: "hptDxW",
              defaultMessage: "to {money}",
              description: "money",
            },
            {
              money: formatMoney(to, locale),
            },
          );
        }
        return "-";
      }}
    </LocaleConsumer>
  );
};

MoneyRange.displayName = "MoneyRange";
export default MoneyRange;
