import { CataloguePredicateAPI } from "@dashboard/discounts/types";
import {
  PromotionDetailsQuery,
  RuleConditionsSelectedOptionsDetailsQuery,
  useRuleConditionsSelectedOptionsDetailsQuery,
} from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export const useFetchConditionsOptionsDetails = (
  promotionData: PromotionDetailsQuery | undefined,
) => {
  const conditionsOptionsIdsToFetch =
    getAllConditionsOptionsIdsToFetch(promotionData);

  const { data: ruleConditionsOptionsDetails, loading } =
    useRuleConditionsSelectedOptionsDetailsQuery({
      variables: conditionsOptionsIdsToFetch,
      skip: Object.values(conditionsOptionsIdsToFetch).every(
        idds => idds.length === 0,
      ),
    });

  return {
    ruleConditionsOptionsDetails,
    ruleConditionsOptionsDetailsLoading: loading,
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

  return data.promotion.rules.reduce<AllConditionsIds>((acc, rule) => {
    Object.entries(rule.cataloguePredicate as CataloguePredicateAPI).forEach(
      ([key, predicate]) => {
        // In case of OR or AND condition
        if (Array.isArray(predicate)) {
          predicate.forEach(item => {
            if (item.productPredicate) {
              acc.productsIds.push(...item.productPredicate.ids);
            }
            if (item.categoryPredicate) {
              acc.categoriesIds.push(...item.categoryPredicate.ids);
            }
            if (item.collectionPredicate) {
              acc.collectionsIds.push(...item.collectionPredicate.ids);
            }
            if (item.variantPredicate) {
              acc.variantsIds.push(...item.variantPredicate.ids);
            }
          });
        } else {
          if (key === "productPredicate") {
            acc.productsIds.push(...predicate.ids);
          }
          if (key === "categoryPredicate") {
            acc.categoriesIds.push(...predicate.ids);
          }
          if (key === "collectionPredicate") {
            acc.collectionsIds.push(...predicate.ids);
          }
          if (key === "variantPredicate") {
            acc.variantsIds.push(...predicate.ids);
          }
        }
      },
    );

    return acc;
  }, initAllConditionsIds);
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
