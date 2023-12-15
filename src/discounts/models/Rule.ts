/* eslint-disable @typescript-eslint/no-extraneous-class */
import {
  CataloguePredicateInput,
  PromotionRuleDetailsFragment,
  PromotionRuleInput,
  RewardValueTypeEnum,
} from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";

import { CataloguePredicateAPI } from "../types";
import { Condition } from "./Condition";

export class Rule {
  constructor(
    public id: string,
    public name: string,
    public description: string | null,
    public channel: Option | null,
    public rewardValue: number,
    public rewardValueType: RewardValueTypeEnum,
    public conditions: Condition[],
  ) {}

  public toAPI(): PromotionRuleInput {
    return {
      name: this.name,
      description: this.description ? JSON.parse(this.description) : null,
      channels: this?.channel ? [this.channel.value] : [],
      rewardValue: this.rewardValue,
      rewardValueType: this.rewardValueType,
      cataloguePredicate: prepareCataloguePredicate(this.conditions),
    };
  }

  public static empty(): Rule {
    return new Rule("", "", "", null, 0, RewardValueTypeEnum.PERCENTAGE, []);
  }

  public static fromAPI(
    rule: PromotionRuleDetailsFragment,
    ruleConditionsOptionsDetailsMap: Record<string, string>,
  ): Rule {
    return new Rule(
      rule.id,
      rule.name ?? "",
      rule.description ? JSON.stringify(rule.description) : "",
      rule?.channels?.length
        ? { label: rule?.channels[0].name, value: rule?.channels[0].id }
        : null,
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
      data.id,
      data.name,
      data.description,
      data.channel,
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
    .map(condition => condition.toAPI())
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

      return Condition.fromAPI(
        { [key]: value } as unknown as CataloguePredicateAPI,
        ruleConditionsOptionsDetailsMap,
      );
    })
    .filter(Boolean)
    .flat() as Condition[];
}
