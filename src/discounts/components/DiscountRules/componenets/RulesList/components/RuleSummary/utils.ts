import { categoryUrl } from "@dashboard/categories/urls";
import { collectionUrl } from "@dashboard/collections/urls";
import {
  hueToPillColorDark,
  hueToPillColorLight,
  stringToHue,
} from "@dashboard/components/Datagrid/customCells/PillCell";
import { isArrayOfOptions, type Rule } from "@dashboard/discounts/models";
import { productUrl, productVariantEditUrl } from "@dashboard/products/urls";
import { type DefaultTheme, type Option } from "@saleor/macaw-ui-next";

import { type EnrichCondition } from "./components/RuleConditionsChips/useEnrichConditions";

export interface ConditionChipOption extends Option {
  entityId?: string;
  conditionType?: string;
}

export const mapConditionToOption = (conditions: EnrichCondition[]): ConditionChipOption[] => {
  return conditions.reduce<ConditionChipOption[]>((acc, condition) => {
    if (isArrayOfOptions(condition.value) && condition.inputType === "multiselect") {
      acc.push(
        ...condition.value.map(conditionValue => ({
          value: conditionValue.label,
          label: condition.label ?? condition.id ?? "",
          entityId: conditionValue.value,
          conditionType: condition.id ?? undefined,
        })),
      );
    } else {
      acc.push({
        label: condition.label ?? condition.id ?? "",
        value: condition.value?.toString() ?? condition.id ?? "",
      });
    }

    return acc;
  }, []);
};

export const conditionTypeToHue = (type: string, theme: DefaultTheme) => {
  const hue = stringToHue(type);

  return theme === "defaultDark" ? hueToPillColorDark(hue) : hueToPillColorLight(hue);
};

export const hasNoRuleConditions = (rule: Rule) => {
  return !rule.conditions.length || rule.conditions.every(condition => !condition?.value?.length);
};

export const getConditionEntityUrl = (
  conditionType: string | undefined,
  entityId: string | undefined,
): string | undefined => {
  if (!conditionType || !entityId) {
    return undefined;
  }

  switch (conditionType) {
    case "product":
      return productUrl(entityId);
    case "collection":
      return collectionUrl(entityId);
    case "category":
      return categoryUrl(entityId);
    case "variant":
      return productVariantEditUrl(entityId);
    default:
      return undefined;
  }
};
