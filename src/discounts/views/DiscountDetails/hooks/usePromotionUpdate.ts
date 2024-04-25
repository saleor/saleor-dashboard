import {
  PromotionDetailsDocument,
  PromotionDetailsFragment,
  usePromotionUpdateMutation,
} from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { useIntl } from "react-intl";

export const usePromotionUpdate = (id: string) => {
  const intl = useIntl();
  const notify = useNotifier();
  const [promotionUpdate, promotionUpdateOpts] = usePromotionUpdateMutation({
    update(cache, { data }) {
      if (data?.promotionUpdate?.errors?.length === 0) {
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
              ...data.promotionUpdate.promotion,
            },
          },
        });
      }
    },
    onCompleted(data) {
      if (data?.promotionUpdate?.errors?.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
      }
    },
  });

  return {
    promotionUpdate,
    promotionUpdateOpts,
  };
};
