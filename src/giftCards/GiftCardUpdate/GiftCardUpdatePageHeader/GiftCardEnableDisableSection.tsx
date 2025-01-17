// @ts-strict-ignore
import { ButtonWithLoader } from "@dashboard/components/ButtonWithLoader/ButtonWithLoader";
import { commonMessages } from "@dashboard/intl";
import React from "react";
import { useIntl } from "react-intl";

import { bulkEnableDisableSectionMessages as buttonMessages } from "../../GiftCardsList/messages";
import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import useGiftCardActivateToggle from "./hooks/useGiftCardActivateToggle";

const GiftCardEnableDisableSection: React.FC = () => {
  const intl = useIntl();
  const {
    giftCard: { id, isActive, isExpired },
  } = useGiftCardDetails();
  const { giftCardActivate, giftCardDeactivate, currentOpts } = useGiftCardActivateToggle({
    isActive,
  });
  const handleClick = () =>
    isActive ? giftCardDeactivate({ variables: { id } }) : giftCardActivate({ variables: { id } });
  const buttonLabel = isActive ? buttonMessages.disableLabel : buttonMessages.enableLabel;

  if (isExpired) {
    return null;
  }

  return (
    <ButtonWithLoader
      data-test-id="enable-button"
      onClick={handleClick}
      transitionState={currentOpts?.status}
    >
      {intl.formatMessage(currentOpts?.status === "error" ? commonMessages.error : buttonLabel)}
    </ButtonWithLoader>
  );
};

export default GiftCardEnableDisableSection;
