import { sortAPIRules } from "@dashboard/discounts/utils";
import {
  PromotionDetailsDocument,
  PromotionDetailsFragment,
  PromotionRuleDetailsFragment,
  usePromotionRuleCreateMutation,
} from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { useIntl } from "react-intl";

export const usePromotionRuleCreate = (id: string) => {
  const intl = useIntl();
  const notify = useNotifier();

  const [promotionRuleCreate, promotionRuleCreateOpts] =
    usePromotionRuleCreateMutation({
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
                rules: sortAPIRules([
                  ...(cachedPromotion.promotion?.rules ?? []),
                  data.promotionRuleCreate.promotionRule,
                ] as PromotionRuleDetailsFragment[]),
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
