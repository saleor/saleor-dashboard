import {
  PromotionRuleDetailsFragment,
  PromotionRuleInput,
} from "@dashboard/graphql";

import { prepareCatalogueRuleConditions } from "./CatalogRule/prepareConditions";
import { prepareCataloguePredicate } from "./CatalogRule/preparePredicate";
import { createBaseAPIInput, createBaseRuleInputFromAPI } from "./helpers";
import { Rule } from "./Rule";

export const mapAPIRuleToForm = (
  type: "catalog" | null | undefined, // to be replaced by PromotionTypeEnum when API return this field
  rule: PromotionRuleDetailsFragment,
  labelMap: Record<string, string>,
): Rule => {
  const baseRuleData = createBaseRuleInputFromAPI(rule);

  if (!type) {
    return {
      ...baseRuleData,
      conditions: [],
    };
  }

  const catalogueConditions = prepareCatalogueRuleConditions(
    rule.cataloguePredicate,
    labelMap,
  );
  return {
    ...baseRuleData,
    conditions: catalogueConditions,
  };
};

export const toAPI =
  (
    discountType: "catalog" | null | undefined, // to be replaced by PromotionTypeEnum when API return this field
  ) =>
  (rule: Rule): PromotionRuleInput => {
    const base = createBaseAPIInput(rule);

    if (!discountType) {
      return base;
    }

    const cataloguePredicate = prepareCataloguePredicate(rule.conditions);

    return {
      ...base,
      cataloguePredicate,
    };
  };
