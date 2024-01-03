import { CataloguePredicateAPI } from "@dashboard/discounts/types";
import {
  PromotionDetailsQuery,
  RuleConditionsSelectedOptionsDetailsQuery,
  useRuleConditionsSelectedOptionsDetailsQuery,
} from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useEffect, useState } from "react";

export const useFetchConditionsOptionsDetails = (
  promotionData: PromotionDetailsQuery | undefined,
) => {
  const conditionsOptionsIdsToFetch =
    getAllConditionsOptionsIdsToFetch(promotionData);

  const [hasBeenLoaded, setHasBeenLoaded] = useState(false);

  const { data: ruleConditionsOptionsDetails, loading } =
    useRuleConditionsSelectedOptionsDetailsQuery({
      variables: conditionsOptionsIdsToFetch,
      skip: whenNoCondtionsIds(conditionsOptionsIdsToFetch) || hasBeenLoaded,
    });

  useEffect(() => {
    if (promotionData?.promotion && !loading) {
      setHasBeenLoaded(true);
    }
  }, [promotionData, loading]);

  return {
    ruleConditionsOptionsDetails,
    ruleConditionsOptionsDetailsLoading: !hasBeenLoaded,
  };
};

interface AllConditionsIds {
  productsIds: string[];
  categoriesIds: string[];
  collectionsIds: string[];
  variantsIds: string[];
}

const initAllConditionsIds: AllConditionsIds = {
  productsIds: [],
  categoriesIds: [],
  collectionsIds: [],
  variantsIds: [],
};

export function getAllConditionsOptionsIdsToFetch(
  data: PromotionDetailsQuery | undefined,
): AllConditionsIds {
  if (!data?.promotion?.rules) {
    return initAllConditionsIds;
  }

  const allConditionsIds = data.promotion.rules.reduce((acc, rule) => {
    reduceConditionsLabels(rule.cataloguePredicate, acc);
    return acc;
  }, initAllConditionsIds);

  return {
    productsIds: Array.from(new Set(allConditionsIds.productsIds)),
    categoriesIds: Array.from(new Set(allConditionsIds.categoriesIds)),
    collectionsIds: Array.from(new Set(allConditionsIds.collectionsIds)),
    variantsIds: Array.from(new Set(allConditionsIds.variantsIds)),
  };
}

function reduceConditionsLabels(
  cataloguePredicate: CataloguePredicateAPI,
  allConditionsIds: AllConditionsIds,
) {
  Object.entries(cataloguePredicate).forEach(([key, predicate]) => {
    if (Array.isArray(predicate)) {
      predicate.forEach(item => reduceConditionsLabels(item, allConditionsIds));
    }

    if (key === "productPredicate") {
      allConditionsIds.productsIds.push(...predicate.ids);
    }
    if (key === "categoryPredicate") {
      allConditionsIds.categoriesIds.push(...predicate.ids);
    }
    if (key === "collectionPredicate") {
      allConditionsIds.collectionsIds.push(...predicate.ids);
    }
    if (key === "variantPredicate") {
      allConditionsIds.variantsIds.push(...predicate.ids);
    }

    return allConditionsIds;
  });
}

export function getRuleConditionsOptionsDetailsMap(
  data: RuleConditionsSelectedOptionsDetailsQuery | undefined,
) {
  if (!data) {
    return {};
  }

  return Object.values(data).reduce<Record<string, string>>((acc, value) => {
    const items =
      mapEdgesToItems(
        value as RuleConditionsSelectedOptionsDetailsQuery["categories"],
      ) ?? [];
    items.forEach(item => {
      acc[item.id] = item.name;
    });

    return acc;
  }, {});
}

function whenNoCondtionsIds(conditionsOptionsIdsToFetch: AllConditionsIds) {
  return Object.values(conditionsOptionsIdsToFetch).every(
    ids => ids.length === 0,
  );
}
