import { Rule } from "@dashboard/discounts/models";
import { PromotionRuleDetailsFragment } from "@dashboard/graphql";

export const filterRules = (
  promotionRules: PromotionRuleDetailsFragment[],
  formRules: Rule[],
  dirtyRulesIndexes: string[],
): Rule[] => {
  if (!promotionRules) {
    return [];
  }

  return formRules.filter((rule, index) => {
    // Selected only dirty rules to update
    if (promotionRules.find(r => r.id === rule.id)) {
      return dirtyRulesIndexes.includes(index.toString());
    }

    // Keep all new added rules
    return true;
  });
};
