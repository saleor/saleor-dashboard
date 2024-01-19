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
import { prepareCatalogueRuleConditions } from "./prepareConditions";
import { prepareCataloguePredicate } from "./preparePredicate";

export class CatalogRule implements Rule {
  public type: "catalog";

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
    this.type = "catalog";
  }

  public static empty(): CatalogRule {
    return new CatalogRule(
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

  public toAPI(): PromotionRuleInput {
    const baseRule = createBaseAPIInput(this);

    return {
      ...baseRule,
      cataloguePredicate: prepareCataloguePredicate(this.conditions),
    };
  }

  public static fromFormValues(data: Rule): CatalogRule {
    return new CatalogRule(
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

    return new CatalogRule(
      baseRuleData.id,
      baseRuleData.name,
      baseRuleData.description,
      baseRuleData.channel,
      baseRuleData.rewardType,
      baseRuleData.rewardValue,
      baseRuleData.rewardValueType,
      prepareCatalogueRuleConditions(
        rule.cataloguePredicate,
        ruleConditionsOptionsDetailsMap,
      ),
    );
  }
}
