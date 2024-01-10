import {
  PromotionRuleDetailsFragment,
  PromotionRuleInput,
  RewardTypeEnum,
  RewardValueTypeEnum,
} from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";

import { RuleType } from "../types";
import { CatalogCondition } from "./Catalog/CatalogCondition";
import { OrderCondition } from "./Order/OrderCondition";

export class Rule {
  constructor(
    public type: RuleType,
    public id: string,
    public name: string,
    public description: string | null,
    public channel: Option | null,
    public rewardType: RewardTypeEnum | null,
    public rewardValue: number,
    public rewardValueType: RewardValueTypeEnum,
    public conditions: Array<CatalogCondition | OrderCondition>,
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

  public static empty(type: RuleType): Rule {
    return new Rule(
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
    ruleConditionsOptionsDetailsMap: Record<string, string>,
  ): Rule {
    return new Rule(
      getRuleType(rule),
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

  public static fromFormValues(data: Rule): Rule {
    return new Rule(
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

function getRewardType(rule: Rule): RewardTypeEnum | null {
  if (rule.type === "order" && !rule.rewardType) {
    return RewardTypeEnum.SUBTOTAL_DISCOUNT;
  }
  return rule.rewardType;
}
