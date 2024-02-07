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
          value.reduce(toObject, {} as CataloguePredicateAPI),
          ruleConditionsOptionsDetailsMap,
        );
      }

      return {
        id: key.split("Predicate")[0],
        type: "is", // Catalog predicate always has only "is" condition type
        value: value.ids?.map(toOptions) ?? [],
      };
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

function toObject(acc: CataloguePredicateAPI, val: Record<string, unknown>) {
  acc = { ...acc, ...val };
  return acc;
}
