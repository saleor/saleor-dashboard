import { sortAPIRules } from "@dashboard/discounts/utils";
import {
  PromotionDetailsDocument,
  PromotionDetailsFragment,
  PromotionRuleCreateMutation,
  PromotionRuleDetailsFragment,
  usePromotionRuleCreateMutation,
} from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { useIntl } from "react-intl";

export const usePromotionRuleCreate = (id: string) => {
  const intl = useIntl();
  const notify = useNotifier();
  const [promotionRuleCreate, promotionRuleCreateOpts] = usePromotionRuleCreateMutation({
    update(cache, { data }) {
      if (data?.promotionRuleCreate?.errors?.length === 0) {
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
              rules: sortAPIRules(addNewRuleToCache(cachedPromotion.promotion, data)),
            },
          },
        });
      }
    },
    onCompleted(data) {
      if (data?.promotionRuleCreate?.errors?.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
      }
    },
  });

  return {
    promotionRuleCreate,
    promotionRuleCreateOpts,
  };
};

function addNewRuleToCache(
  cachedPromotion: PromotionDetailsFragment,
  data: PromotionRuleCreateMutation,
) {
  const cachedRules = cachedPromotion?.rules ?? [];

  return [
    ...cachedRules,
    data.promotionRuleCreate?.promotionRule,
  ] as PromotionRuleDetailsFragment[];
}
