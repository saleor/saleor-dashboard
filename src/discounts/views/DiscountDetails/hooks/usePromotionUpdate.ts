import {
  PromotionDetailsDocument,
  type PromotionDetailsFragment,
  type PromotionUpdateMutation,
  type PromotionUpdateMutationVariables,
  usePromotionUpdateMutation,
} from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { useRef } from "react";
import { useIntl } from "react-intl";

type PromotionUpdateFn = (options: {
  variables: PromotionUpdateMutationVariables;
  /** Skip success toast + cache write (used for the Saleor end-date clear workaround). */
  silent?: boolean;
}) => ReturnType<ReturnType<typeof usePromotionUpdateMutation>[0]>;

export const usePromotionUpdate = (id: string) => {
  const intl = useIntl();
  const notify = useNotifier();
  const silentRef = useRef(false);
  const [mutate, promotionUpdateOpts] = usePromotionUpdateMutation({
    update(cache, { data }) {
      if (silentRef.current) {
        return;
      }

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
      if (silentRef.current) {
        silentRef.current = false;

        return;
      }

      if (data?.promotionUpdate?.errors?.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "OKVWjP",
            defaultMessage: "Promotion updated",
            description: "promotion details save success toast",
          }),
        });
      }
    },
  });

  const promotionUpdate: PromotionUpdateFn = ({ variables, silent = false }) => {
    silentRef.current = silent;

    return mutate({ variables });
  };

  return {
    promotionUpdate,
    promotionUpdateOpts,
  };
};

export type { PromotionUpdateMutation, PromotionUpdateMutationVariables };
