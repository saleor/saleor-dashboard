import ConfirmButton from "@saleor/components/ConfirmButton";
import { IMessage } from "@saleor/components/messages";
import {
  useGiftCardBulkActivateMutation,
  useGiftCardBulkDeactivateMutation,
} from "@saleor/graphql";
import useNotifier from "@saleor/hooks/useNotifier";
import { getByIds } from "@saleor/orders/components/OrderReturnPage/utils";
import React from "react";
import { useIntl } from "react-intl";

import { useGiftCardList } from "../../providers/GiftCardListProvider";
import { GIFT_CARD_LIST_QUERY } from "../../queries";
import { bulkEnableDisableSectionMessages as messages } from "./messages";

const BulkEnableDisableSection: React.FC = () => {
  const intl = useIntl();
  const notify = useNotifier();

  const { listElements: ids, reset, giftCards } = useGiftCardList();

  const hasAnyEnabledCardsSelected = giftCards
    .filter(getByIds(ids))
    .some(({ isActive }) => isActive);

  const areAllSelectedCardsActive = giftCards
    .filter(getByIds(ids))
    .every(({ isActive }) => isActive);

  const hasAnyDisabledCardsSelected = giftCards
    .filter(getByIds(ids))
    .some(({ isActive }) => !isActive);

  const areAllSelectedCardsDisabled = giftCards
    .filter(getByIds(ids))
    .every(({ isActive }) => !isActive);

  const [
    activateGiftCards,
    activateGiftCardsOpts,
  ] = useGiftCardBulkActivateMutation({
    onCompleted: data => {
      const { errors, count } = data?.giftCardBulkActivate;

      const notifierData: IMessage = !!errors?.length
        ? {
            status: "error",
            text: intl.formatMessage(messages.errorActivateAlertText, {
              count,
            }),
          }
        : {
            status: "success",
            text: intl.formatMessage(messages.successActivateAlertText, {
              count,
            }),
          };

      notify(notifierData);

      if (!errors.length) {
        reset();
      }
    },
    refetchQueries: [GIFT_CARD_LIST_QUERY],
  });

  const [
    deactivateGiftCards,
    deactivateGiftCardsOpts,
  ] = useGiftCardBulkDeactivateMutation({
    onCompleted: data => {
      const { errors, count } = data?.giftCardBulkDeactivate;

      const notifierData: IMessage = !!errors?.length
        ? {
            status: "error",
            text: intl.formatMessage(messages.errorDeactivateAlertText, {
              count,
            }),
          }
        : {
            status: "success",
            text: intl.formatMessage(messages.successDeactivateAlertText, {
              count,
            }),
          };

      notify(notifierData);

      if (!errors.length) {
        reset();
      }
    },
    refetchQueries: [GIFT_CARD_LIST_QUERY],
  });

  const handleActivateGiftCards = () =>
    activateGiftCards({ variables: { ids } });

  const handleDeactivateGiftCards = () =>
    deactivateGiftCards({ variables: { ids } });

  const isSelectionMixed =
    hasAnyEnabledCardsSelected && hasAnyDisabledCardsSelected;

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

export default BulkEnableDisableSection;
