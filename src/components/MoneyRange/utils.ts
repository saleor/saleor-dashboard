import { IMoney } from "@dashboard/utils/intl";
import { IntlShape } from "react-intl";

import { Locale } from "../Locale";
import { formatMoney, formatMoneyRange } from "../Money";

export const getMoneyRange = (
  locale: Locale,
  intl: IntlShape,
  from?: IMoney,
  to?: IMoney,
): string => {
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
};
