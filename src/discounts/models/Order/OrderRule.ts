import {
  PromotionRuleDetailsFragment,
  PromotionRuleInput,
  RewardTypeEnum,
  RewardValueTypeEnum,
} from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";

import { Rule } from "../Rule";
import { OrderCondition } from "./OrderCondition";
import { prepareOrderConditions } from "./prepareConditions";
import { prepareOrderPredicate } from "./preparePredicate";

export class OrderRule extends Rule {
  private constructor(
    public type: "order",
    public id: string,
    public name: string,
    public description: string | null,
    public channel: Option | null,
    public rewardType: RewardTypeEnum | null,
    public rewardValue: number,
    public rewardValueType: RewardValueTypeEnum,
    public conditions: OrderCondition[],
  ) {
    super(
      type,
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
  ): Rule {
    const baseRule = super.fromAPI(rule, ruleConditionsOptionsDetailsMap);

    baseRule.conditions = prepareOrderConditions(
      rule.cataloguePredicate,
      ruleConditionsOptionsDetailsMap,
    );

    return baseRule;
  }
}
