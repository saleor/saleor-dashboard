import {
  PromotionRuleDetailsFragment,
  PromotionRuleInput,
  RewardTypeEnum,
  RewardValueTypeEnum,
} from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";

import { Condition } from "../Condition";
import { createBaseAPIInput, createBaseRuleInputFromAPI } from "../helpers";
import { BaseRule } from "../types";
import { prepareOrderConditions } from "./prepareConditions";
import { prepareOrderPredicate } from "./preparePredicate";

export class OrderRule implements BaseRule {
  constructor(
    public type: "order",
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
    const baseRule = createBaseAPIInput(this);

    return {
      ...baseRule,
      checkoutAndOrderPredicate: prepareOrderPredicate(this.conditions),
    };
  }

  public static empty(): OrderRule {
    return new OrderRule(
      "order",
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

  public static fromFormValues(data: BaseRule): OrderRule {
    return new OrderRule(
      "order",
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
    const baseRuleData = createBaseRuleInputFromAPI(rule);
    const baseRule = new OrderRule(
      "order",
      baseRuleData.id,
      baseRuleData.name,
      baseRuleData.description,
      baseRuleData.channel,
      baseRuleData.rewardType,
      baseRuleData.rewardValue,
      baseRuleData.rewardValueType,
      [],
    );

    baseRule.conditions = prepareOrderConditions(
      rule.cataloguePredicate,
      ruleConditionsOptionsDetailsMap,
    );

    return baseRule;
  }
}
