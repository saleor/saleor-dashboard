import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { ConfirmButton } from "@saleor/macaw-ui";
import commonErrorMessages from "@saleor/utils/errors/common";
import React from "react";
import { useIntl } from "react-intl";

import { bulkEnableDisableSectionMessages as buttonMessages } from "../../GiftCardsList/GiftCardsListTable/GiftCardsListTableHeader/messages";
import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import { giftCardEnableDisableSectionMessages as messages } from "./messages";
import {
  useGiftCardActivateMutation,
  useGiftCardDeactivateMutation
} from "./mutations";
import { GiftCardActivate } from "./types/GiftCardActivate";
import { GiftCardDeactivate } from "./types/GiftCardDeactivate";

const GiftCardEnableDisableSection: React.FC = () => {
  const notify = useNotifier();
  const intl = useIntl();

  const {
    giftCard: { id, isActive, isExpired }
  } = useGiftCardDetails();

  if (isExpired) {
    return null;
  }

  const onActivateCompleted = (data: GiftCardActivate) => {
    const errors = data?.giftCardActivate?.errors;

    if (!!errors?.length) {
      notify({
        status: "error",
        text: intl.formatMessage(commonErrorMessages.unknownError)
      });

      return;
    }

    notify({
      status: "success",
      text: intl.formatMessage(messages.successfullyEnabledTitle)
    });
  };

  const onDeactivateCompleted = (data: GiftCardDeactivate) => {
    const errors = data?.giftCardDeactivate?.errors;

    if (!!errors?.length) {
      notify({
        status: "error",
        text: intl.formatMessage(commonErrorMessages.unknownError)
      });
      return;
    }

    notify({
      status: "success",
      text: intl.formatMessage(messages.successfullyDisabledTitle)
    });
  };

  const [giftCardActivate, giftCardActivateOpts] = useGiftCardActivateMutation({
    onCompleted: onActivateCompleted
  });

  const [
    giftCardDeactivate,
    giftCardDeactivateOpts
  ] = useGiftCardDeactivateMutation({
    onCompleted: onDeactivateCompleted
  });

  const handleClick = () =>
    isActive
      ? giftCardDeactivate({ variables: { id } })
      : giftCardActivate({ variables: { id } });

  const buttonLabel = isActive
    ? buttonMessages.disableLabel
    : buttonMessages.enableLabel;

  const currentOpts = isActive ? giftCardDeactivateOpts : giftCardActivateOpts;

  return (
    <ConfirmButton
      data-test-id="enable-button"
      onClick={handleClick}
      transitionState={currentOpts?.status}
      labels={{
        confirm: intl.formatMessage(buttonLabel),
        error: intl.formatMessage(commonMessages.error)
      }}
    />
  );
};

export default GiftCardEnableDisableSection;
