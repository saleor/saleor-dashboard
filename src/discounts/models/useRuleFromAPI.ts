import {
  PromotionRuleDetailsFragment,
  PromotionTypeEnum,
} from "@dashboard/graphql";

import { prepareCatalogueRuleConditions } from "./CatalogRule/prepareConditions";
import { createBaseRuleInputFromAPI } from "./helpers";
import { prepareOrderConditions } from "./OrderRule/prepareConditions";
import { Rule } from "./types";

export const mapAPIRuleToForm = (
  type: PromotionTypeEnum,
  rule: PromotionRuleDetailsFragment,
  labelMap: Record<string, string>,
): Rule => {
  const baseRuleData = createBaseRuleInputFromAPI(rule);
  const catalogueConditions = prepareCatalogueRuleConditions(
    rule.cataloguePredicate,
    labelMap,
  );
  const orderconditions = prepareOrderConditions(
    rule.orderPredicate?.discountedObjectPredicate ?? {},
  );

  return {
    ...baseRuleData,
    conditions:
      type === PromotionTypeEnum.CATALOGUE
        ? catalogueConditions
        : orderconditions,
  };
};
