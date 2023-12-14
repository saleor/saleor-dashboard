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
    if (!this.type) {
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

  public static fromAPI(
    condition: CataloguePredicateAPI,
    ruleConditionsOptionsDetailsMap: Record<string, string>,
  ): Condition {
    if (condition.productPredicate) {
      return new Condition(
        "product",
        "is",
        condition.productPredicate.ids.map(id => ({
          label: ruleConditionsOptionsDetailsMap[id] || id,
          value: id,
        })),
      );
    }

    if (condition.categoryPredicate) {
      return new Condition(
        "category",
        "is",
        condition.categoryPredicate.ids.map(id => ({
          label: ruleConditionsOptionsDetailsMap[id] || id,
          value: id,
        })),
      );
    }

    if (condition.collectionPredicate) {
      return new Condition(
        "collection",
        "is",
        condition.collectionPredicate.ids.map(id => ({
          label: ruleConditionsOptionsDetailsMap[id] || id,
          value: id,
        })),
      );
    }

    if (condition.variantPredicate) {
      return new Condition(
        "variant",
        "is",
        condition.variantPredicate.ids.map(id => ({
          label: ruleConditionsOptionsDetailsMap[id] || id,
          value: id,
        })),
      );
    }

    return new Condition(null, "is", []);
  }
}
