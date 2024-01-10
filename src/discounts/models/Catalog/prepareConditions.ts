import { CataloguePredicateAPI } from "@dashboard/discounts/types";

import { CatalogCondition } from "./CatalogCondition";

export function prepareCatalogueRuleConditions(
  cataloguePredicate: CataloguePredicateAPI,
  ruleConditionsOptionsDetailsMap: Record<string, string>,
): CatalogCondition[] {
  const toOptions = createToOptionMap(ruleConditionsOptionsDetailsMap);

  return Object.entries(cataloguePredicate)
    .map(([key, value]) => {
      if (key === "OR") {
        return prepareCatalogueRuleConditions(
          value.reduce(
            (acc: CataloguePredicateAPI, val: Record<string, unknown>) => {
              acc = { ...acc, ...val };
              return acc;
            },
            {} as CataloguePredicateAPI,
          ),
          ruleConditionsOptionsDetailsMap,
        );
      }

      if (value.productPredicate) {
        return new CatalogCondition(
          "product",
          "is",
          value.productPredicate.ids.map(toOptions),
        );
      }

      if (value.categoryPredicate) {
        return new CatalogCondition(
          "category",
          "is",
          value.categoryPredicate.ids.map(toOptions),
        );
      }

      if (value.collectionPredicate) {
        return new CatalogCondition(
          "collection",
          "is",
          value.collectionPredicate.ids.map(toOptions),
        );
      }

      if (value.variantPredicate) {
        return new CatalogCondition(
          "variant",
          "is",
          value.variantPredicate.ids.map(toOptions),
        );
      }

      return new CatalogCondition(null, "is", []);
    })
    .filter(Boolean)
    .flat() as CatalogCondition[];
}

function createToOptionMap(
  ruleConditionsOptionsDetailsMap: Record<string, string>,
) {
  return (id: string) => ({
    label: ruleConditionsOptionsDetailsMap[id] || id,
    value: id,
  });
}
