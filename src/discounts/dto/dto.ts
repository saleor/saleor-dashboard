/* eslint-disable @typescript-eslint/no-extraneous-class */
import {
  CataloguePredicateInput,
  PromotionRuleDetailsFragment,
  PromotionRuleInput,
  RewardValueTypeEnum,
} from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";

import { CataloguePredicateAPI, Condition, Rule } from "../types";

export class RuleDTO {
  static toAPI(rule: Rule): PromotionRuleInput {
    return {
      name: rule.name,
      description: rule.description ? JSON.parse(rule.description) : null,
      channels: rule.channels.map(channel => channel.value),
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
      channels: rule.channels.map<Option>(channel => ({
        label: channel.name,
        value: channel.id,
      })),
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
  ): Condition {
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
  const ruleConditions = conditions.map(ConditionDTO.toAPI).filter(Boolean);

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
          value.reduce((acc, val) => {
            acc = { ...acc, ...val };
            return acc;
          }, {}),
          ruleConditionsOptionsDetailsMap,
        );
      }

      return ConditionDTO.fromAPI(
        { [key]: value } as unknown as CataloguePredicateAPI,
        ruleConditionsOptionsDetailsMap,
      );
    })
    .flat();
}
