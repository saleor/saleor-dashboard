import {
  PromotionRuleDetailsFragment,
  PromotionRuleInput,
  RewardTypeEnum,
  RewardValueTypeEnum,
} from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";

import { Rule } from "../Rule";
import { CatalogCondition } from "./CatalogCondition";
import { prepareCatalogueRuleConditions } from "./prepareConditions";
import { prepareCataloguePredicate } from "./preparePredicate";

export class CatalogRule extends Rule {
  private constructor(
    public type: "catalog",
    public id: string,
    public name: string,
    public description: string | null,
    public channel: Option | null,
    public rewardType: RewardTypeEnum | null,
    public rewardValue: number,
    public rewardValueType: RewardValueTypeEnum,
    public conditions: CatalogCondition[],
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
      cataloguePredicate: prepareCataloguePredicate(this.conditions),
    };
  }

  public static fromAPI(
    rule: PromotionRuleDetailsFragment,
    ruleConditionsOptionsDetailsMap: Record<string, string>,
  ): Rule {
    const baseRule = super.fromAPI(rule, ruleConditionsOptionsDetailsMap);

    baseRule.conditions = prepareCatalogueRuleConditions(
      rule.cataloguePredicate,
      ruleConditionsOptionsDetailsMap,
    );

    return baseRule;
  }
}
