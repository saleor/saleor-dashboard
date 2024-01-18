import {
  hueToPillColorDark,
  hueToPillColorLight,
  stringToHue,
} from "@dashboard/components/Datagrid/customCells/PillCell";
import { Condition, Rule } from "@dashboard/discounts/models";
import { CatalogConditions, OrderConditions } from "@dashboard/discounts/types";
import { DefaultTheme, Option } from "@saleor/macaw-ui-next";

const MAX_ITEMS_TO_SHOW = 3;
export type OptionWithConditionType = Option & {
  type: CatalogConditions | OrderConditions;
};

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
    if (Array.isArray(condition.values)) {
      acc.push(
        ...condition.values.map<OptionWithConditionType>(value => ({
          ...value,
          type: condition.name as CatalogConditions | OrderConditions,
        })),
      );
    } else {
      acc.push({
        label: condition.values,
        value: condition.values,
        type: condition.name as CatalogConditions | OrderConditions,
      });
    }

    return acc;
  }, []);
};

export const conditionTypeToHue = (
  type: OrderConditions | CatalogConditions,
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
    rule.conditions.every(condition => !condition.values.length)
  );
};
