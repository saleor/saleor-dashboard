import ConfirmButton from "@saleor/components/ConfirmButton";
import { IMessage } from "@saleor/components/messages";
import useNotifier from "@saleor/hooks/useNotifier";
import React from "react";
import { useIntl } from "react-intl";

import useGiftCardListBulkActions from "../../providers/GiftCardListProvider/hooks/useGiftCardListBulkActions";
import { bulkEnableDisableSectionMessages as messages } from "./messages";
import {
  useGiftCardBulkActivateMutation,
  useGiftCardBulkDeactivateMutation
} from "./mutations";
import { GiftCardBulkActivate } from "./types/GiftCardBulkActivate";
import { GiftCardBulkDeactivate } from "./types/GiftCardBulkDeactivate";

const BulkEnableDisableSection: React.FC = () => {
  const intl = useIntl();
  const notify = useNotifier();

  const { listElements: ids } = useGiftCardListBulkActions();

  const onActivateCompleted = (data: GiftCardBulkActivate) => {
    const { errors, count } = data?.giftCardBulkActivate;

    const notifierData: IMessage = !!errors?.length
      ? {
          status: "error",
          text: intl.formatMessage(messages.errorActivateAlertText, { count })
        }
      : {
          status: "success",
          text: intl.formatMessage(messages.successActivateAlertText, { count })
        };

    notify(notifierData);
  };

  const onDeactivateCompleted = (data: GiftCardBulkDeactivate) => {
    const { errors, count } = data?.giftCardBulkDeactivate;

    const notifierData: IMessage = !!errors?.length
      ? {
          status: "error",
          text: intl.formatMessage(messages.errorDeactivateAlertText, { count })
        }
      : {
          status: "success",
          text: intl.formatMessage(messages.successDeactivateAlertText, {
            count
          })
        };

    notify(notifierData);
  };

  const [
    activateGiftCards,
    activateGiftCardsOpts
  ] = useGiftCardBulkActivateMutation({
    onCompleted: onActivateCompleted
  });

  const [
    deactivateGiftCards,
    deactivateGiftCardsOpts
  ] = useGiftCardBulkDeactivateMutation({
    onCompleted: onDeactivateCompleted
  });

  const handleActivateGiftCards = () =>
    activateGiftCards({ variables: { ids } });

  const handleDeactivateGiftCards = () =>
    deactivateGiftCards({ variables: { ids } });

  return (
    <>
      <ConfirmButton
        onClick={handleActivateGiftCards}
        variant="text"
        transitionState={activateGiftCardsOpts?.status}
      >
        {intl.formatMessage(messages.enableLabel)}
      </ConfirmButton>
      <ConfirmButton
        onClick={handleDeactivateGiftCards}
        variant="text"
        transitionState={deactivateGiftCardsOpts?.status}
      >
        {intl.formatMessage(messages.disableLabel)}
      </ConfirmButton>
    </>
  );
};

export default BulkEnableDisableSection;
