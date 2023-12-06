import {
  hueToPillColorDark,
  hueToPillColorLight,
  stringToHue,
} from "@dashboard/components/Datagrid/customCells/PillCell";
import { Condition, ConditionType } from "@dashboard/discounts/types";
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
  return conditions.reduce<OptionWithConditionType[]>(
    toConditionOptionWithType,
    [],
  );
};

const toConditionOptionWithType = (
  acc: OptionWithConditionType[],
  condition: Condition,
) => {
  return [
    ...acc,
    ...condition.values.map(value => ({ ...value, type: condition.type })),
  ];
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
