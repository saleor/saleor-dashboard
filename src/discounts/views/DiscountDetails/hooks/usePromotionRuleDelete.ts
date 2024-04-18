import { sortAPIRules } from "@dashboard/discounts/utils";
import {
  PromotionDetailsDocument,
  PromotionDetailsFragment,
  PromotionRuleDeleteMutation,
  PromotionRuleDetailsFragment,
  usePromotionRuleDeleteMutation,
} from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { useIntl } from "react-intl";

export const usePromotionRuleDelete = (id: string) => {
  const intl = useIntl();
  const notify = useNotifier();
  const [promotionRuleDelete, promotionRuleDeleteOpts] = usePromotionRuleDeleteMutation({
    update(cache, { data }) {
      if (data?.promotionRuleDelete?.errors?.length === 0) {
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
              rules: sortAPIRules(removeRuleFromCache(cachedPromotion.promotion, data)),
            },
          },
        });
      }
    },
    onCompleted(data) {
      if (data?.promotionRuleDelete?.errors?.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
      }
    },
  });

  return {
    promotionRuleDelete,
    promotionRuleDeleteOpts,
  };
};

function removeRuleFromCache(
  cachedPromotion: PromotionDetailsFragment,
  data: PromotionRuleDeleteMutation,
) {
  return (
    cachedPromotion.rules?.filter(
      (rule: PromotionRuleDetailsFragment) =>
        rule.id !== data?.promotionRuleDelete?.promotionRule?.id,
    ) ?? []
  );
}
