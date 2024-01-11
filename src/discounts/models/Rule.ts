import {
  PromotionRuleDetailsFragment,
  PromotionRuleInput,
  RewardTypeEnum,
  RewardValueTypeEnum,
} from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";

import { RuleType } from "../types";
import { Condition } from "./Condition";

export class BaseRule {
  constructor(
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
    };
  }

  public static empty(type: RuleType): BaseRule {
    return new BaseRule(
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
    _: Record<string, string>,
  ): BaseRule {
    return new BaseRule(
      getRuleType(rule) as any,
      rule.id,
      rule.name ?? "",
      rule.description ? JSON.stringify(rule.description) : "",
      rule?.channels?.length
        ? { label: rule?.channels[0].name, value: rule?.channels[0].id }
        : null,
      rule?.rewardType ?? null,
      rule.rewardValue ?? null,
      rule.rewardValueType ?? RewardValueTypeEnum.FIXED,
      [],
    );
  }

  public static fromFormValues(data: BaseRule): BaseRule {
    return new BaseRule(
      data.type,
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
}

function getRuleType(rule: PromotionRuleDetailsFragment): RuleType {
  if (rule.cataloguePredicate) {
    return "catalog";
  }

  return "order";
}

function getRewardType(rule: BaseRule): RewardTypeEnum | null {
  if (rule.type === "order" && !rule.rewardType) {
    return RewardTypeEnum.SUBTOTAL_DISCOUNT;
  }
  return rule.rewardType;
}
