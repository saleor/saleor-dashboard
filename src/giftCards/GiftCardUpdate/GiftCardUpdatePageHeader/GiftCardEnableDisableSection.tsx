import { commonMessages } from "@saleor/intl";
import { ConfirmButton } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { bulkEnableDisableSectionMessages as buttonMessages } from "../../GiftCardsList/GiftCardsListTable/GiftCardsListTableHeader/messages";
import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import useGiftCardActivationDeactivation from "./hooks/useGiftCardActivationDeactivation";

const GiftCardEnableDisableSection: React.FC = () => {
  const intl = useIntl();

  const {
    giftCard: { id, isActive, isExpired }
  } = useGiftCardDetails();

  if (isExpired) {
    return null;
  }

  const {
    giftCardActivate,
    giftCardActivateOpts,
    giftCardDeactivate,
    giftCardDeactivateOpts
  } = useGiftCardActivationDeactivation();

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
