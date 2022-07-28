import { commonMessages } from "@saleor/intl";
import { ConfirmButton } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { bulkEnableDisableSectionMessages as buttonMessages } from "../../GiftCardsList/GiftCardsListTable/GiftCardsListTableHeader/messages";
import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import useGiftCardActivateToggle from "./hooks/useGiftCardActivateToggle";

const GiftCardEnableDisableSection: React.FC = () => {
  const intl = useIntl();

  const {
    giftCard: { id, isActive, isExpired },
  } = useGiftCardDetails();

  const {
    giftCardActivate,
    giftCardDeactivate,
    currentOpts,
  } = useGiftCardActivateToggle({
    isActive,
  });

  const handleClick = () =>
    isActive
      ? giftCardDeactivate({ variables: { id } })
      : giftCardActivate({ variables: { id } });

  const buttonLabel = isActive
    ? buttonMessages.disableLabel
    : buttonMessages.enableLabel;

  if (isExpired) {
    return null;
  }

  return (
    <ConfirmButton
      data-test-id="enable-button"
      onClick={handleClick}
      transitionState={currentOpts?.status}
      labels={{
        confirm: intl.formatMessage(buttonLabel),
        error: intl.formatMessage(commonMessages.error),
      }}
    />
  );
};

export default GiftCardEnableDisableSection;
