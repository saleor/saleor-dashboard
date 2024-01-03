import { sortAPIRules } from "@dashboard/discounts/utils";
import {
  PromotionDetailsDocument,
  PromotionDetailsFragment,
  PromotionRuleDetailsFragment,
  PromotionRuleUpdateMutation,
  usePromotionRuleUpdateMutation,
} from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { useIntl } from "react-intl";

export const usePromotionRuleUpdate = (id: string) => {
  const intl = useIntl();
  const notify = useNotifier();

  const [promotionRuleUpdate, promotionRuleUpdateOpts] =
    usePromotionRuleUpdateMutation({
      update(cache, { data }) {
        if (data?.promotionRuleUpdate?.errors?.length === 0) {
          const cachedPromotion = cache.readQuery<{
            promotion: PromotionDetailsFragment;
          }>({
            query: PromotionDetailsDocument,
            variables: {
              id,
            },
          });

          if (!cachedPromotion?.promotion) {
            return;
          }

          cache.writeQuery({
            query: PromotionDetailsDocument,
            data: {
              promotion: {
                ...cachedPromotion.promotion,
                rules: sortAPIRules(
                  updateRulesCache(cachedPromotion.promotion, data),
                ),
              },
            },
          });
        }
      },
      onCompleted(data) {
        if (data?.promotionRuleUpdate?.errors?.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
          });
        }
      },
    });

  return {
    promotionRuleUpdate,
    promotionRuleUpdateOpts,
  };
};

function updateRulesCache(
  cachedPromotion: PromotionDetailsFragment,
  data: PromotionRuleUpdateMutation,
) {
  const cachedRules =
    cachedPromotion.rules?.filter(byNoUpdatedRules(data)) ?? [];

  return [
    ...cachedRules,
    data.promotionRuleUpdate?.promotionRule,
  ] as PromotionRuleDetailsFragment[];
}

function byNoUpdatedRules(data: PromotionRuleUpdateMutation) {
  return (rule: PromotionRuleDetailsFragment) =>
    rule.id !== data.promotionRuleUpdate?.promotionRule?.id;
}
