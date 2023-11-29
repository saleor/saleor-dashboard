import { RuleDTO } from "@dashboard/discounts/dto/dto";
import { CataloguePredicateAPI, Rule } from "@dashboard/discounts/types";
import {
  ConditionsDetailsQuery,
  PromotionDetailsFragment,
  PromotionDetailsQuery,
  PromotionRuleInput,
  PromotionRuleUpdateInput,
} from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import difference from "lodash/difference";

interface AllConditionsIds {
  productsIds: string[];
  categoriesIds: string[];
  collectionsIds: string[];
  variantsIds: string[];
}

const initAllConditionsIds: AllConditionsIds = {
  productsIds: [],
  categoriesIds: [],
  collectionsIds: [],
  variantsIds: [],
};

export const getAllConditionsIds = (
  data: PromotionDetailsQuery,
): AllConditionsIds => {
  if (!data?.promotion?.rules) {
    return initAllConditionsIds;
  }

  return data.promotion.rules.reduce<AllConditionsIds>((acc, rule) => {
    Object.values(rule.cataloguePredicate as CataloguePredicateAPI).forEach(
      predicate => {
        if (Array.isArray(predicate)) {
          predicate.forEach(ored => {
            if (ored.productPredicate) {
              acc.productsIds.push(...ored.productPredicate.ids);
            }
            if (ored.categoryPredicate) {
              acc.categoriesIds.push(...ored.categoryPredicate.ids);
            }
            if (ored.collectionPredicate) {
              acc.collectionsIds.push(...ored.collectionPredicate.ids);
            }
            if (ored.variantPredicate) {
              acc.variantsIds.push(...ored.variantPredicate.ids);
            }
          });
        }
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
      },
    );

    return acc;
  }, initAllConditionsIds);
};

export const getConditonLabels = (
  data: ConditionsDetailsQuery | undefined,
): Record<string, string> => {
  if (!data) {
    return {};
  }

  return Object.values(data).reduce((acc, value) => {
    const items =
      mapEdgesToItems(value as ConditionsDetailsQuery["categories"]) ?? [];
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
