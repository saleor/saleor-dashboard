import {
  PromotionRuleDetailsFragment,
  PromotionRuleInput,
  RewardTypeEnum,
  RewardValueTypeEnum,
} from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";

import { BaseRule } from "../BaseRule";
import { Condition } from "../Condition";
import { prepareCatalogueRuleConditions } from "./prepareConditions";
import { prepareCataloguePredicate } from "./preparePredicate";

export class CatalogRule extends BaseRule {
  constructor(
    public id: string,
    public name: string,
    public description: string | null,
    public channel: Option | null,
    public rewardType: RewardTypeEnum | null,
    public rewardValue: number,
    public rewardValueType: RewardValueTypeEnum,
    public conditions: Condition[],
  ) {
    super(
      "catalog",
      id,
      name,
      description,
      channel,
      rewardType,
      rewardValue,
      rewardValueType,
      conditions,
    );
  }

  public toAPI(): PromotionRuleInput {
    const baseRule = super.toAPI();
    return {
      ...baseRule,
      cataloguePredicate: prepareCataloguePredicate(this.conditions),
    };
  }

  public static fromFormValues(data: BaseRule): CatalogRule {
    return new CatalogRule(
      data.id,
      data.name,
      data.description,
      data.channel,
      data.rewardType,
      data.rewardValue,
      data.rewardValueType,
      [],
    );
  }

  public static fromAPI(
    rule: PromotionRuleDetailsFragment,
    ruleConditionsOptionsDetailsMap: Record<string, string>,
  ): BaseRule {
    const baseRule = super.fromAPI(rule, ruleConditionsOptionsDetailsMap);

    baseRule.conditions = prepareCatalogueRuleConditions(
      rule.cataloguePredicate,
      ruleConditionsOptionsDetailsMap,
    );

    return baseRule;
  }
}
