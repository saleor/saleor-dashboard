import { CataloguePredicateInput } from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";

import { CataloguePredicateAPI, ConditionType } from "../types";

export class Condition {
  constructor(
    public type: ConditionType | null,
    public condition: "is",
    public values: Option[],
  ) {}

  public toAPI(): CataloguePredicateInput | undefined {
    if (!this.type || !this.values.length) {
      return undefined;
    }

    return {
      [`${this.type}Predicate`]: {
        ids: this.values.map(val => val.value),
      },
    };
  }

  public static empty(): Condition {
    return new Condition(null, "is", []);
  }

  public static fromFormValues(data: Condition): Condition {
    return new Condition(data.type, data.condition, data.values);
  }

  public static fromAPI(
    condition: CataloguePredicateAPI,
    ruleConditionsOptionsDetailsMap: Record<string, string>,
  ): Condition {
    const toOptions = createToOptionMap(ruleConditionsOptionsDetailsMap);

    if (condition.productPredicate) {
      return new Condition(
        "product",
        "is",
        condition.productPredicate.ids.map(toOptions),
      );
    }

    if (condition.categoryPredicate) {
      return new Condition(
        "category",
        "is",
        condition.categoryPredicate.ids.map(toOptions),
      );
    }

    if (condition.collectionPredicate) {
      return new Condition(
        "collection",
        "is",
        condition.collectionPredicate.ids.map(toOptions),
      );
    }

    if (condition.variantPredicate) {
      return new Condition(
        "variant",
        "is",
        condition.variantPredicate.ids.map(toOptions),
      );
    }

    return new Condition(null, "is", []);
  }
}

function createToOptionMap(
  ruleConditionsOptionsDetailsMap: Record<string, string>,
) {
  return (id: string) => ({
    label: ruleConditionsOptionsDetailsMap[id] || id,
    value: id,
  });
}
