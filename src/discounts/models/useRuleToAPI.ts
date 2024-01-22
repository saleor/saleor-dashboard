import { PromotionRuleInput } from "@dashboard/graphql";

import { prepareCataloguePredicate } from "./CatalogRule/preparePredicate";
import { createBaseAPIInput } from "./helpers";
import { prepareOrderPredicate } from "./OrderRule/preparePredicate";
import { Rule } from "./types";

export const mapRuleToAPI = (rule: Rule): PromotionRuleInput => {
  const base = createBaseAPIInput(rule);
  const orderPredicate =
    rule.type === "order" ? prepareOrderPredicate(rule.conditions) : undefined;

  const cataloguePredicate =
    rule.type === "catalog"
      ? prepareCataloguePredicate(rule.conditions)
      : undefined;

  return {
    ...base,
    orderPredicate,
    cataloguePredicate,
  };
};
