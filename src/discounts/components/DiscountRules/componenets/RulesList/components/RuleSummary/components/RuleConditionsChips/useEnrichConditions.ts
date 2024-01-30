import { Locale } from "@dashboard/components/Locale";
import { useConditionNames } from "@dashboard/discounts/components/DiscountRules/componenets/RuleForm/components/RuleConditionName/useConditionNames";
import { useCondtionTypes } from "@dashboard/discounts/components/DiscountRules/componenets/RuleForm/components/RuleConditionType/useConditionTypes";
import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context";
import { Condition } from "@dashboard/discounts/models";
import useLocale from "@dashboard/hooks/useLocale";
import { IntlShape, useIntl } from "react-intl";

import { messages } from "../../messages";
import { formatMoney, formatMoneyRange } from "./formatLable";

export type EnrichCondition = Condition & {
  inputType: string | null;
  label?: string;
};

// Add input type
// Add label that map to condition type from context
// Add values that format to proper format base on type, e.g.:  price, price.range
export const useEnrichConditions = (
  conditions: Condition[],
  currencySymbol: string,
): EnrichCondition[] => {
  const { locale } = useLocale();
  const intl = useIntl();
  const { discountType } = useDiscountRulesContext();
  const { getConditionTypeByLabel } = useCondtionTypes();
  const { conditionNames } = useConditionNames(discountType);

  return conditions.map(condition => {
    const conditionInputType = getConditionTypeByLabel(
      condition.id ?? "",
      condition.type,
    );
    const conditionLabel = conditionNames.find(
      option => option.value === condition.id ?? "",
    );

    const enrichedCondition = {
      ...condition,
      inputType: conditionInputType,
      label: conditionLabel?.label,
    };

    if (
      conditionInputType &&
      ["price", "price.range"].includes(conditionInputType)
    ) {
      return {
        ...enrichedCondition,
        value: formatPrice(enrichedCondition, currencySymbol, locale, intl),
      };
    }

    return enrichedCondition;
  });
};

function formatPrice(
  condition: EnrichCondition,
  currencySymbol: string,
  locale: Locale,
  intl: IntlShape,
): string {
  if (condition.type === "between") {
    return formatMoneyRange(condition, currencySymbol, locale);
  }

  if (condition.type === "greater") {
    return intl.formatMessage(messages.greaterThan, {
      value: formatMoney(condition, currencySymbol, locale),
    });
  }

  if (condition.type === "lower") {
    return intl.formatMessage(messages.lowerThan, {
      value: formatMoney(condition, currencySymbol, locale),
    });
  }

  return formatMoney(condition, currencySymbol, locale);
}
