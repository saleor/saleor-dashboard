import { useApolloClient } from "@apollo/client";
import { getVoucherSaveRequestErrors } from "@dashboard/discounts/voucherSaveRequestErrors";
import {
  PromotionDetailsDocument,
  type PromotionDetailsFragment,
  type PromotionUpdateMutationVariables,
  usePromotionUpdateMutation,
} from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { useRef } from "react";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
  endDateNotRestored: {
    id: "NaDOHw",
    defaultMessage:
      "The end date was removed and could not be put back. The promotion now has no end date.",
    description:
      "promotion details error toast when an end date cleared before a failed save could not be restored",
  },
});

type PromotionUpdateFn = (options: {
  variables: PromotionUpdateMutationVariables;
  /**
   * Skip the success toast and the cache, for the Saleor end-date clear workaround. The page
   * keeps the merchant's edits until the main update succeeds.
   */
  silent?: boolean;
}) => ReturnType<ReturnType<typeof usePromotionUpdateMutation>[0]>;

export const usePromotionUpdate = (id: string) => {
  const intl = useIntl();
  const notify = useNotifier();
  const client = useApolloClient();
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
  // A separate mutation, so restoring the end date does not replace the failed update's errors
  // and button state on the page.
  const [restoreEndDateMutate, restoreEndDateOpts] = usePromotionUpdateMutation({
    fetchPolicy: "no-cache",
    disableErrorHandling: true,
  });

  const promotionUpdate: PromotionUpdateFn = ({ variables, silent = false }) => {
    silentRef.current = silent;

    return mutate({ variables, fetchPolicy: silent ? "no-cache" : undefined });
  };

  /** Puts back an end date that was cleared before an update that then failed. */
  const restoreEndDate = async (endDate: string): Promise<boolean> => {
    const result = await restoreEndDateMutate({ variables: { id, input: { endDate } } });
    const errors = getVoucherSaveRequestErrors(result, data => data.promotionUpdate?.errors);

    if (errors.length === 0) {
      return true;
    }

    notify({
      status: "error",
      text: intl.formatMessage(messages.endDateNotRestored),
    });

    // The API answered but refused the old end date: the update may have gone through after all
    // (its response was lost), so show what is stored. When the request itself failed, a reload
    // would likely fail too; keep the merchant's edits so they can save again.
    if (result.data?.promotionUpdate) {
      await client
        .query({ query: PromotionDetailsDocument, variables: { id }, fetchPolicy: "network-only" })
        .catch(() => undefined);
    }

    return false;
  };

  return {
    promotionUpdate,
    promotionUpdateOpts,
    restoreEndDate,
    restoreEndDateOpts,
  };
};
