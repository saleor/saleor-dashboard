import {
  hueToPillColorDark,
  hueToPillColorLight,
  stringToHue,
} from "@dashboard/components/Datagrid/customCells/PillCell";
import { isArrayOfOptions, Rule } from "@dashboard/discounts/models";
import { DefaultTheme, Option } from "@saleor/macaw-ui-next";

import { EnrichCondition } from "./components/RuleConditionsChips/useEnrichConditions";

const MAX_ITEMS_TO_SHOW = 3;

export const splitConditions = (
  conditions: Option[],
): {
  conditionsInSummary: Option[];
  conditionsInTooltip: Option[];
} => {
  const conditionsInSummary = conditions.slice(0, MAX_ITEMS_TO_SHOW);
  const conditionsInTooltip = conditions.slice(MAX_ITEMS_TO_SHOW);

  return {
    conditionsInSummary,
    conditionsInTooltip,
  };
};

export const mapConditionToOption = (
  conditions: EnrichCondition[],
): Option[] => {
  return conditions.reduce<Option[]>((acc, condition) => {
    if (
      isArrayOfOptions(condition.value) &&
      condition.inputType === "multiselect"
    ) {
      // Flat each condition array of Options
      acc.push(
        ...condition.value.map(conditionValue => ({
          value: conditionValue.label,
          label: condition.label ?? condition.id ?? "",
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
  return theme === "defaultDark"
    ? hueToPillColorDark(hue)
    : hueToPillColorLight(hue);
};

export const hasNoRuleConditions = (rule: Rule) => {
  return (
    !rule.conditions.length ||
    rule.conditions.every(condition => !condition?.value?.length)
  );
};
