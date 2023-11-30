import { RuleDTO } from "@dashboard/discounts/dto/dto";
import { Rule } from "@dashboard/discounts/types";
import {
  PromotionDetailsFragment,
  PromotionRuleInput,
  PromotionRuleUpdateInput,
} from "@dashboard/graphql";
import difference from "lodash/difference";

export const getRulesToUpdateData = (
  dataRules: Rule[],
  promotionRules: PromotionDetailsFragment["rules"],
) => {
  return dataRules.reduce<
    Array<{ id: string; input: PromotionRuleUpdateInput }>
  >((acc, rule) => {
    const savedRule = promotionRules?.find(
      promotionRule => promotionRule.id === rule.id,
    );

    if (savedRule) {
      const { channels, ...ruleInput } = RuleDTO.toAPI(rule);
      const savedRuleChannels =
        savedRule?.channels.map(channel => channel.id) ?? [];

      acc.push({
        id: rule.id,
        input: {
          ...ruleInput,
          addChannels: difference(channels, savedRuleChannels),
          removeChannels: difference(savedRuleChannels, channels),
        },
      });
    }
    return acc;
  }, []);
};

export const getRulesToCreateData = (
  dataRules: Rule[],
  promotionRules: PromotionDetailsFragment["rules"],
) => {
  return dataRules.reduce<PromotionRuleInput[]>((acc, rule) => {
    if (!promotionRules.find(promotionRule => promotionRule.id === rule.id)) {
      acc.push(RuleDTO.toAPI(rule));
    }
    return acc;
  }, []);
};
