import { ConfirmButton } from "@dashboard/components/ConfirmButton";
import { IMessage } from "@dashboard/components/messages";
import {
  useGiftCardBulkActivateMutation,
  useGiftCardBulkDeactivateMutation,
} from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
import { getByIds } from "@dashboard/orders/components/OrderReturnPage/utils";
import React from "react";
import { useIntl } from "react-intl";

import { bulkEnableDisableSectionMessages as messages } from "../messages";
import { useGiftCardList } from "../providers/GiftCardListProvider";
import { GIFT_CARD_LIST_QUERY } from "../queries";

export const GiftCardListBulkActions: React.FC = () => {
  const intl = useIntl();
  const notify = useNotifier();
  const { selectedRowIds, clearRowSelection, giftCards } = useGiftCardList();
  const hasAnyEnabledCardsSelected = giftCards
    .filter(getByIds(selectedRowIds))
    .some(({ isActive }) => isActive);
  const areAllSelectedCardsActive = giftCards
    .filter(getByIds(selectedRowIds))
    .every(({ isActive }) => isActive);
  const hasAnyDisabledCardsSelected = giftCards
    .filter(getByIds(selectedRowIds))
    .some(({ isActive }) => !isActive);
  const areAllSelectedCardsDisabled = giftCards
    .filter(getByIds(selectedRowIds))
    .every(({ isActive }) => !isActive);
  const [activateGiftCards, activateGiftCardsOpts] = useGiftCardBulkActivateMutation({
    onCompleted: data => {
      const notifierData: IMessage = data?.giftCardBulkActivate?.errors?.length
        ? {
            status: "error",
            text: intl.formatMessage(messages.errorActivateAlertText, {
              count: data?.giftCardBulkActivate?.count,
            }),
          }
        : {
            status: "success",
            text: intl.formatMessage(messages.successActivateAlertText, {
              count: data?.giftCardBulkActivate?.count,
            }),
          };

      notify(notifierData);

      if (!data?.giftCardBulkActivate?.errors?.length) {
        clearRowSelection();
      }
    },
    refetchQueries: [GIFT_CARD_LIST_QUERY],
  });
  const [deactivateGiftCards, deactivateGiftCardsOpts] = useGiftCardBulkDeactivateMutation({
    onCompleted: data => {
      const notifierData: IMessage = data?.giftCardBulkDeactivate?.errors?.length
        ? {
            status: "error",
            text: intl.formatMessage(messages.errorDeactivateAlertText, {
              count: data?.giftCardBulkDeactivate?.count,
            }),
          }
        : {
            status: "success",
            text: intl.formatMessage(messages.successDeactivateAlertText, {
              count: data?.giftCardBulkDeactivate?.count,
            }),
          };

      notify(notifierData);

      if (!data?.giftCardBulkDeactivate?.errors?.length) {
        clearRowSelection();
      }
    },
    refetchQueries: [GIFT_CARD_LIST_QUERY],
  });
  const handleActivateGiftCards = async () => {
    await activateGiftCards({ variables: { ids: selectedRowIds } });
    clearRowSelection();
  };
  const handleDeactivateGiftCards = async () => {
    await deactivateGiftCards({ variables: { ids: selectedRowIds } });
    clearRowSelection();
  };
  const isSelectionMixed = hasAnyEnabledCardsSelected && hasAnyDisabledCardsSelected;

  return (
    <>
      {(areAllSelectedCardsDisabled || isSelectionMixed) && (
        <ConfirmButton
          onClick={handleActivateGiftCards}
          variant="secondary"
          transitionState={activateGiftCardsOpts?.status}
          data-test-id="activate-gift-cards"
        >
          {intl.formatMessage(messages.enableLabel)}
        </ConfirmButton>
      )}
      {(areAllSelectedCardsActive || isSelectionMixed) && (
        <ConfirmButton
          onClick={handleDeactivateGiftCards}
          variant="secondary"
          transitionState={deactivateGiftCardsOpts?.status}
          data-test-id="deactivate-gift-cards"
        >
          {intl.formatMessage(messages.disableLabel)}
        </ConfirmButton>
      )}
    </>
  );
};
