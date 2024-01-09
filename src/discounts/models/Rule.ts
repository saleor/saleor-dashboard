/* eslint-disable @typescript-eslint/no-extraneous-class */
import {
  CataloguePredicateInput,
  CheckoutAndOrderPredicateInput,
  PromotionRuleDetailsFragment,
  PromotionRuleInput,
  RewardTypeEnum,
  RewardValueTypeEnum,
} from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";

import { CataloguePredicateAPI, RuleType } from "../types";
import { Condition } from "./Condition";

export class Rule {
  private constructor(
    public type: RuleType,
    public id: string,
    public name: string,
    public description: string | null,
    public channel: Option | null,
    public rewardType: RewardTypeEnum | null,
    public rewardValue: number,
    public rewardValueType: RewardValueTypeEnum,
    public conditions: Condition[],
  ) {}

  public toAPI(): PromotionRuleInput {
    return {
      name: this.name,
      description: this.description ? JSON.parse(this.description) : null,
      channels: this?.channel ? [this.channel.value] : [],
      rewardType: getRewardType(this),
      rewardValue: this.rewardValue,
      rewardValueType: this.rewardValueType,
      cataloguePredicate:
        this.type === "catalog"
          ? prepareCataloguePredicate(this.conditions)
          : undefined,
      checkoutAndOrderPredicate:
        this.type === "checkout"
          ? prepareCheckoutAndOrderPredicate(this.conditions)
          : undefined,
    };
  }

  public static empty(type: RuleType): Rule {
    return new Rule(
      type,
      "",
      "",
      "",
      null,
      null,
      0,
      RewardValueTypeEnum.PERCENTAGE,
      [],
    );
  }

  public static fromAPI(
    rule: PromotionRuleDetailsFragment,
    ruleConditionsOptionsDetailsMap: Record<string, string>,
  ): Rule {
    return new Rule(
      getRuleType(rule),
      rule.id,
      rule.name ?? "",
      rule.description ? JSON.stringify(rule.description) : "",
      rule?.channels?.length
        ? { label: rule?.channels[0].name, value: rule?.channels[0].id }
        : null,
      rule?.rewardType ?? null,
      rule.rewardValue ?? null,
      rule.rewardValueType ?? RewardValueTypeEnum.FIXED,
      prepareRuleConditions(
        rule.cataloguePredicate,
        ruleConditionsOptionsDetailsMap,
      ),
    );
  }

  public static fromFormValues(data: Rule): Rule {
    return new Rule(
      data.type,
      data.id,
      data.name,
      data.description,
      data.channel,
      data.rewardType,
      data.rewardValue,
      data.rewardValueType,
      data.conditions.map(condition => Condition.fromFormValues(condition)),
    );
  }
}

function prepareCataloguePredicate(
  conditions: Condition[],
): CataloguePredicateInput {
  const ruleConditions = conditions
    .map(condition => {
      if (!condition.type) {
        return undefined;
      }

      return {
        [`${condition.type}Predicate`]: {
          ids: condition.values.map(val => val.value),
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

function prepareCheckoutAndOrderPredicate(
  conditions: Condition[],
): CheckoutAndOrderPredicateInput {
  const ruleConditions = conditions
    .map(condition => {
      if (!condition.type) {
        return undefined;
      }

      return {
        [`${condition.type}Predicate`]: {
          ids: condition.values.map(val => val.value),
        },
      };
    })
    .filter(Boolean) as CheckoutAndOrderPredicateInput[];

  if (ruleConditions.length === 0) {
    return {};
  }

  if (ruleConditions.length === 1) {
    return {
      ...ruleConditions[0],
    };
  }
}

function prepareRuleConditions(
  cataloguePredicate: CataloguePredicateAPI,
  ruleConditionsOptionsDetailsMap: Record<string, string>,
): Condition[] {
  const toOptions = createToOptionMap(ruleConditionsOptionsDetailsMap);

  return Object.entries(cataloguePredicate)
    .map(([key, value]) => {
      if (key === "OR") {
        return prepareRuleConditions(
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

function getRuleType(rule: PromotionRuleDetailsFragment): RuleType {
  if (rule.cataloguePredicate) {
    return "catalog";
  }

  return "checkout";
}

function getRewardType(rule: Rule): RewardTypeEnum | null {
  if (rule.type === "checkout" && !rule.rewardType) {
    return RewardTypeEnum.SUBTOTAL_DISCOUNT;
  }
  return rule.rewardType;
}

function createToOptionMap(
  ruleConditionsOptionsDetailsMap: Record<string, string>,
) {
  return (id: string) => ({
    label: ruleConditionsOptionsDetailsMap[id] || id,
    value: id,
  });
}
