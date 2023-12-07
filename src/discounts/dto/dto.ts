/* eslint-disable @typescript-eslint/no-extraneous-class */
import {
  CataloguePredicateInput,
  PromotionRuleDetailsFragment,
  PromotionRuleInput,
  RewardValueTypeEnum,
} from "@dashboard/graphql";

import { CataloguePredicateAPI, Condition, Rule } from "../types";

export class RuleDTO {
  static toAPI(rule: Rule): PromotionRuleInput {
    return {
      name: rule.name,
      description: rule.description ? JSON.parse(rule.description) : null,
      channels: rule?.channel ? [rule.channel.value] : [],
      rewardValue: rule.rewardValue,
      rewardValueType: rule.rewardValueType,
      cataloguePredicate: prepareCataloguePredicate(rule.conditions),
    };
  }

  static fromAPI(
    rule: PromotionRuleDetailsFragment,
    ruleConditionsOptionsDetailsMap: Record<string, string>,
  ): Rule {
    return {
      id: rule.id,
      channel: rule?.channels?.length
        ? { label: rule?.channels[0].name, value: rule?.channels[0].id }
        : null,
      name: rule.name ?? "",
      description: rule.description ? JSON.stringify(rule.description) : "",
      rewardValue: rule.rewardValue ?? null,
      rewardValueType: rule.rewardValueType ?? RewardValueTypeEnum.FIXED,
      conditions: prepareRuleConditions(
        rule.cataloguePredicate,
        ruleConditionsOptionsDetailsMap,
      ),
    };
  }
}

export class ConditionDTO {
  static toAPI(condition: Condition): CataloguePredicateInput | undefined {
    if (!condition.type) {
      return undefined;
    }

    return {
      [`${condition.type}Predicate`]: {
        ids: condition.values.map(val => val.value),
      },
    };
  }

  static fromAPI(
    condition: CataloguePredicateAPI,
    ruleConditionsOptionsDetailsMap: Record<string, string>,
  ): Condition | undefined {
    if (condition.productPredicate) {
      return {
        type: "product",
        condition: "is",
        values: condition.productPredicate.ids.map(id => ({
          label: ruleConditionsOptionsDetailsMap[id] || id,
          value: id,
        })),
      };
    }

    if (condition.categoryPredicate) {
      return {
        type: "category",
        condition: "is",
        values: condition.categoryPredicate.ids.map(id => ({
          label: ruleConditionsOptionsDetailsMap[id] || id,
          value: id,
        })),
      };
    }

    if (condition.collectionPredicate) {
      return {
        type: "collection",
        condition: "is",
        values: condition.collectionPredicate.ids.map(id => ({
          label: ruleConditionsOptionsDetailsMap[id] || id,
          value: id,
        })),
      };
    }
    if (condition.variantPredicate) {
      return {
        type: "variant",
        condition: "is",
        values: condition.variantPredicate.ids.map(id => ({
          label: ruleConditionsOptionsDetailsMap[id] || id,
          value: id,
        })),
      };
    }

    return undefined;
  }
}

function prepareCataloguePredicate(
  conditions: Condition[],
): CataloguePredicateInput {
  const ruleConditions = conditions
    .map(ConditionDTO.toAPI)
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

function prepareRuleConditions(
  cataloguePredicate: CataloguePredicateAPI,
  ruleConditionsOptionsDetailsMap: Record<string, string>,
): Condition[] {
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

      return ConditionDTO.fromAPI(
        { [key]: value } as unknown as CataloguePredicateAPI,
        ruleConditionsOptionsDetailsMap,
      );
    })
    .filter(Boolean)
    .flat() as Condition[];
}
