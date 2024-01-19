import {
  PromotionRuleDetailsFragment,
  PromotionRuleInput,
  RewardTypeEnum,
  RewardValueTypeEnum,
} from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";

import { Condition } from "../Condition";
import { createBaseAPIInput, createBaseRuleInputFromAPI } from "../helpers";
import { Rule } from "../types";
import { prepareOrderConditions } from "./prepareConditions";
import { prepareOrderPredicate } from "./preparePredicate";

export class OrderRule implements Rule {
  public type: "order";

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
    this.type = "order";
  }

  public toAPI(): PromotionRuleInput {
    const baseRule = createBaseAPIInput(this);

    return {
      ...baseRule,
      orderPredicate: prepareOrderPredicate(this.conditions),
    };
  }

  public static empty(): OrderRule {
    return new OrderRule(
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

  public static fromFormValues(data: Rule): OrderRule {
    return new OrderRule(
      data.id,
      data.name,
      data.description,
      data.channel,
      data.rewardType,
      data.rewardValue,
      data.rewardValueType,
      data.conditions,
    );
  }

  public static fromAPI(
    rule: PromotionRuleDetailsFragment,
    ruleConditionsOptionsDetailsMap: Record<string, string>,
  ): Rule {
    const baseRuleData = createBaseRuleInputFromAPI(rule);

    return new OrderRule(
      baseRuleData.id,
      baseRuleData.name,
      baseRuleData.description,
      baseRuleData.channel,
      baseRuleData.rewardType,
      baseRuleData.rewardValue,
      baseRuleData.rewardValueType,
      prepareOrderConditions(
        rule.orderPredicate?.discountedObjectPredicate ?? {},
        // ruleConditionsOptionsDetailsMap,
      ),
    );
  }
}
