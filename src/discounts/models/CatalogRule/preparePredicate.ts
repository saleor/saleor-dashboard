import { CataloguePredicateInput } from "@dashboard/graphql";

import { Condition, isArrayOfOptions } from "../Condition";

export function prepareCataloguePredicate(
  conditions: Condition[],
): CataloguePredicateInput {
  const ruleConditions = conditions
    .map(condition => {
      if (!condition.id || !condition.value.length) {
        return undefined;
      }

      return {
        [`${condition.id}Predicate`]: {
          ids: isArrayOfOptions(condition.value)
            ? condition.value.map(val => val.value)
            : [condition.value],
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
