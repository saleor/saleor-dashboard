import { CataloguePredicateInput } from "@dashboard/graphql";

import { Condition } from "../Condition";

export function prepareCataloguePredicate(
  conditions: Condition[],
): CataloguePredicateInput {
  const ruleConditions = conditions
    .map(condition => {
      if (!condition.name) {
        return undefined;
      }

      return {
        [`${condition.name}Predicate`]: {
          ids: Array.isArray(condition.values)
            ? condition.values.map(val => val.value)
            : [condition.values],
        },
      };
    })
    .filter(Boolean) as CataloguePredicateInput[];

  if (ruleConditions.length === 0) {
    return {};
  }

  if (ruleConditions.length === 1) {
    return {
      ...ruleConditions[0],
    };
  }

  return {
    OR: ruleConditions,
  };
}
