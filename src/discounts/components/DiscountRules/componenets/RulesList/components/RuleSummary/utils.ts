import {
  hueToPillColorDark,
  hueToPillColorLight,
  stringToHue,
} from "@dashboard/components/Datagrid/customCells/PillCell";
import { Condition, isArrayOfOptions, Rule } from "@dashboard/discounts/models";
import { ConditionType } from "@dashboard/discounts/types";
import { DefaultTheme, Option } from "@saleor/macaw-ui-next";

const MAX_ITEMS_TO_SHOW = 3;
export type OptionWithConditionType = Option & { type: ConditionType };

export const splitConditions = (
  conditions: OptionWithConditionType[],
): {
  conditionsInSummary: OptionWithConditionType[];
  conditionsInTooltip: OptionWithConditionType[];
} => {
  const conditionsInSummary = conditions.slice(0, MAX_ITEMS_TO_SHOW);
  const conditionsInTooltip = conditions.slice(MAX_ITEMS_TO_SHOW);

  return {
    conditionsInSummary,
    conditionsInTooltip,
  };
};

export const mapConditionToOption = (
  conditions: Condition[],
): OptionWithConditionType[] => {
  return conditions.reduce<OptionWithConditionType[]>((acc, condition) => {
    if (isArrayOfOptions(condition.value)) {
      acc.push(
        ...condition.value.map<OptionWithConditionType>(value => ({
          ...value,
          type: condition.id as ConditionType,
        })),
      );
    }

    return acc;
  }, []);
};

export const conditionTypeToHue = (
  type: ConditionType,
  theme: DefaultTheme,
) => {
  const hue = stringToHue(type);
  return theme === "defaultDark"
    ? hueToPillColorDark(hue)
    : hueToPillColorLight(hue);
};

export const hasNoRuleConditions = (rule: Rule) => {
  return (
    !rule.conditions.length ||
    rule.conditions.every(condition => !condition.value?.length)
  );
};
