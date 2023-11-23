/* eslint-disable @typescript-eslint/no-extraneous-class */
import {
  CataloguePredicateInput,
  PromotionRuleDetailsFragment,
  PromotionRuleInput,
} from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";

import { CataloguePredicateAPI, Condition, Rule } from "../types";

export class RuleDTO {
  static toAPI(rule: Rule): PromotionRuleInput {
    return {
      name: rule.name,
      description: JSON.parse(rule.description),
      channels: rule.channels.map(channel => channel.value),
      rewardValue: rule.rewardValue,
      rewardValueType: rule.rewardValueType,
      cataloguePredicate: {
        OR: rule.conditions.map(ConditionDTO.toAPI),
      },
    };
  }

  static fromAPI(rule: PromotionRuleDetailsFragment): Rule {
    return {
      channels: rule.channels.map<Option>(chan => ({
        label: chan.name,
        value: chan.id,
      })),
      name: rule.name,
      description: JSON.stringify(rule.description),
      rewardValue: rule.rewardValue,
      rewardValueType: rule.rewardValueType,
      conditions: (rule.cataloguePredicate.OR || []).map(ConditionDTO.fromAPI),
    };
  }
}

export class ConditionDTO {
  static toAPI(condition: Condition): CataloguePredicateInput {
    return {
      [`${condition.type}Predicate`]: {
        ids: condition.values.map(val => val.value),
      },
    };
  }

  static fromAPI(condition: CataloguePredicateAPI): Condition {
    if (condition.productPredicate) {
      return {
        type: "product",
        condition: "is",
        values: condition.productPredicate.ids.map(id => ({
          label: id,
          value: id,
        })),
      };
    }

    if (condition.categoryPredicate) {
      return {
        type: "categorie",
        condition: "is",
        values: condition.categoryPredicate.ids.map(id => ({
          label: id,
          value: id,
        })),
      };
    }

    if (condition.collectionPredicate) {
      return {
        type: "collection",
        condition: "is",
        values: condition.collectionPredicate.ids.map(id => ({
          label: id,
          value: id,
        })),
      };
    }
    if (condition.variantPredicate) {
      return {
        type: "variant",
        condition: "is",
        values: condition.variantPredicate.ids.map(id => ({
          label: id,
          value: id,
        })),
      };
    }
  }
}
