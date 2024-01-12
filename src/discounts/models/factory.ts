import { PromotionRuleDetailsFragment } from "@dashboard/graphql";

import { DiscountType } from "../types";
import { CatalogRule } from "./CatalogRule/CatalogRule";
import { OrderRule } from "./OrderRule/OrderRule";
import { Rule } from "./types";

export const createEmptyRule = (type: DiscountType) => {
  if (type === "catalog") {
    return CatalogRule.empty();
  }

  if (type === "order") {
    return OrderRule.empty();
  }

  return null;
};

export const createRuleFromData = (data: Rule) => {
  if (data.type === "catalog") {
    return CatalogRule.fromFormValues(data);
  }

  if (data.type === "order") {
    return OrderRule.fromFormValues(data);
  }

  return null;
};

export const createRuleFromAPI = (
  type: DiscountType,
  ruleData: PromotionRuleDetailsFragment,
  labelMap: Record<string, string>,
) => {
  if (type === "catalog") {
    return CatalogRule.fromAPI(ruleData, labelMap);
  }

  if (type === "order") {
    return OrderRule.fromAPI(ruleData, labelMap);
  }

  return null;
};
