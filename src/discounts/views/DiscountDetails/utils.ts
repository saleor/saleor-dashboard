import { RuleDTO } from "@dashboard/discounts/dto/dto";
import { Rule } from "@dashboard/discounts/types";
import {
  ConditionsDetailsQuery,
  PromotionDetailsFragment,
  PromotionDetailsQuery,
  PromotionRuleInput,
  PromotionRuleUpdateInput,
} from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import difference from "lodash/difference";

export const getAllConditionsIds = (
  data: PromotionDetailsQuery,
): {
  productsIds: string[];
  categoriesIds: string[];
  collectionsIds: string[];
  variantsIds: string[];
} => {
  return (data?.promotion?.rules ?? []).reduce(
    (acc, rule) => {
      rule.cataloguePredicate.OR.forEach(predicate => {
        if (predicate.productPredicate) {
          acc.productsIds.push(...predicate.productPredicate.ids);
        }
        if (predicate.categoryPredicate) {
          acc.categoriesIds.push(...predicate.categoryPredicate.ids);
        }
        if (predicate.collectionPredicate) {
          acc.collectionsIds.push(...predicate.collectionPredicate.ids);
        }
        if (predicate.variantPredicate) {
          acc.variantsIds.push(...predicate.variantPredicate.ids);
        }
      });
      return acc;
    },
    {
      productsIds: [],
      categoriesIds: [],
      collectionsIds: [],
      variantsIds: [],
    },
  );
};

export const getConditonLabels = (
  data: ConditionsDetailsQuery | undefined,
): Record<string, string> => {
  if (!data) {
    return {};
  }

  return Object.values(data).reduce((acc, value) => {
    const items = mapEdgesToItems(
      value as ConditionsDetailsQuery["categories"],
    );
    items.forEach(item => {
      acc[item.id] = item.name;
    });

    return acc;
  }, {});
};

export const getRulesToUpdateData = (
  dataRules: Rule[],
  promotionRules: PromotionDetailsFragment["rules"],
) => {
  return dataRules.reduce<
    Array<{ id: string; input: PromotionRuleUpdateInput }>
  >((acc, rule) => {
    const savedRule = promotionRules.find(
      promotionRule => promotionRule.id === rule.id,
    );

    if (savedRule) {
      const { channels, ...ruleInput } = RuleDTO.toAPI(rule);
      const savedRuleChannels = savedRule.channels.map(channel => channel.id);

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
