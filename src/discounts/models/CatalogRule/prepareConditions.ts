import { CataloguePredicateAPI } from "@dashboard/discounts/types";

import { Condition } from "../Condition";

export function prepareCatalogueRuleConditions(
  cataloguePredicate: CataloguePredicateAPI,
  ruleConditionsOptionsDetailsMap: Record<string, string>,
): Condition[] {
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
        return new Condition(
          "product",
          "is",
          value.productPredicate.ids.map(toOptions),
        );
      }

      if (value.categoryPredicate) {
        return new Condition(
          "category",
          "is",
          value.categoryPredicate.ids.map(toOptions),
        );
      }

      if (value.collectionPredicate) {
        return new Condition(
          "collection",
          "is",
          value.collectionPredicate.ids.map(toOptions),
        );
      }

      if (value.variantPredicate) {
        return new Condition(
          "variant",
          "is",
          value.variantPredicate.ids.map(toOptions),
        );
      }

      return new Condition(null, "is", []);
    })
    .filter(Boolean)
    .flat() as Condition[];
}

function createToOptionMap(
  ruleConditionsOptionsDetailsMap: Record<string, string>,
) {
  return (id: string) => ({
    label: ruleConditionsOptionsDetailsMap[id] || id,
    value: id,
  });
}
