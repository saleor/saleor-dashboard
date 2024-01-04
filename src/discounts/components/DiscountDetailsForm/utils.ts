import { Rule } from "@dashboard/discounts/models";

export const getCurrentConditionsValuesLabels = (rules: Rule[]) => {
  return rules
    .flatMap(rule => rule.conditions)
    .flatMap(condition => condition.values)
    .reduce((acc, value) => {
      // Initali value and label might contain  id
      if (value.value !== value.label) {
        acc[value.value] = value.label;
      }
      return acc;
    }, {} as Record<string, string>);
};
