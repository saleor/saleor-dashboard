import { Locale } from "@dashboard/components/Locale";
import {
  formatMoney as formatMoneyUtils,
  formatMoneyRange as formatMoneyRangeUtils,
} from "@dashboard/components/Money";
import { Condition, isTuple } from "@dashboard/discounts/models";

export const formatMoneyRange = (condition: Condition, currencySymbol: string, locale: Locale) => {
  if (!isTuple(condition.value)) {
    return "";
  }

  return formatMoneyRangeUtils(
    {
      amount: Number(condition.value[0]),
      currency: currencySymbol,
    },
    {
      amount: Number(condition.value[1]),
      currency: currencySymbol,
    },
    locale,
  );
};

export const formatMoney = (condition: Condition, currencySymbol: string, locale: Locale) => {
  return formatMoneyUtils(
    {
      amount: Number(condition.value),
      currency: currencySymbol,
    },
    locale,
  );
};
