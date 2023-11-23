import {
  ConditionsDetailsQuery,
  PromotionDetailsQuery,
} from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export const getAllConditionsIds = (
  data: PromotionDetailsQuery,
): {
  productsIds: string[];
  categoriesIds: string[];
  collectionsIds: string[];
  variantsIds: string[];
} => {
  return (data?.promotion?.rules ?? []).reduce(
    (acc, rule) => {
      rule.cataloguePredicate.OR.forEach(predicate => {
        if (predicate.productPredicate) {
          acc.productsIds.push(...predicate.productPredicate.ids);
        }
        if (predicate.categoryPredicate) {
          acc.categoriesIds.push(...predicate.categoryPredicate.ids);
        }
        if (predicate.collectionPredicate) {
          acc.collectionsIds.push(...predicate.collectionPredicate.ids);
        }
        if (predicate.variantPredicate) {
          acc.variantsIds.push(...predicate.variantPredicate.ids);
        }
      });
      return acc;
    },
    {
      productsIds: [],
      categoriesIds: [],
      collectionsIds: [],
      variantsIds: [],
    },
  );
};

export const getConditonLabels = (
  data: ConditionsDetailsQuery | undefined,
): Record<string, string> => {
  if (!data) {
    return {};
  }

  return Object.values(data).reduce((acc, value) => {
    const items = mapEdgesToItems(
      value as ConditionsDetailsQuery["categories"],
    );
    items.forEach(item => {
      acc[item.id] = item.name;
    });

    return acc;
  }, {});
};
