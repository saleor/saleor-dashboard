import { Locale } from "@dashboard/components/Locale";
import {
  formatMoney as formatMoneyUtils,
  formatMoneyRange as formatMoneyRangeUtils,
} from "@dashboard/components/Money";
import { Condition } from "@dashboard/discounts/models";

export const formatMoneyRange = (
  condition: Condition,
  currencySymbol: string,
  locale: Locale,
) => {
  if (!condition.values || !Array.isArray(condition.values)) {
    return "";
  }

  return formatMoneyRangeUtils(
    {
      amount: Number(condition.values[0]),
      currency: currencySymbol,
    },
    {
      amount: Number(condition.values[1]),
      currency: currencySymbol,
    },
    locale,
  );
};

export const formatMoney = (
  condition: Condition,
  currencySymbol: string,
  locale: Locale,
) => {
  return formatMoneyUtils(
    {
      amount: Number(condition.values),
      currency: currencySymbol,
    },
    locale,
  );
};
