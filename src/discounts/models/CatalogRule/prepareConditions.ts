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

      return new Condition(
        key.split("Predicate")[0],
        "is",
        value.ids.map(toOptions),
      );
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
