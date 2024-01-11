import {
  PromotionRuleDetailsFragment,
  PromotionRuleInput,
  RewardTypeEnum,
  RewardValueTypeEnum,
} from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";

import { Condition } from "../Condition";
import { BaseRule } from "../Rule";
import { prepareOrderConditions } from "./prepareConditions";
import { prepareOrderPredicate } from "./preparePredicate";

export class OrderRule extends BaseRule {
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
      "order",
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
      checkoutAndOrderPredicate: prepareOrderPredicate(this.conditions),
    };
  }

  public static fromAPI(
    rule: PromotionRuleDetailsFragment,
    ruleConditionsOptionsDetailsMap: Record<string, string>,
  ): BaseRule {
    const baseRule = super.fromAPI(rule, ruleConditionsOptionsDetailsMap);

    baseRule.conditions = prepareOrderConditions(
      rule.cataloguePredicate,
      ruleConditionsOptionsDetailsMap,
    );

    return baseRule;
  }
}
