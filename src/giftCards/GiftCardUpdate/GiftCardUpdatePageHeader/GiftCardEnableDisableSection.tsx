import { ButtonWithLoader } from "@dashboard/components/ButtonWithLoader/ButtonWithLoader";
import { commonMessages } from "@dashboard/intl";
import { useIntl } from "react-intl";

import { bulkEnableDisableSectionMessages as buttonMessages } from "../../GiftCardsList/messages";
import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import useGiftCardActivateToggle from "./hooks/useGiftCardActivateToggle";

export const GiftCardEnableDisableSection = (): JSX.Element | null => {
  const intl = useIntl();
  const { giftCard } = useGiftCardDetails();
  const { giftCardActivate, giftCardDeactivate, currentOpts } = useGiftCardActivateToggle({
    isActive: giftCard?.isActive,
  });

  if (!giftCard || giftCard.isExpired) {
    return null;
  }

  const { id, isActive } = giftCard;
  const handleClick = (): void => {
    if (isActive) {
      giftCardDeactivate({ variables: { id } });
    } else {
      giftCardActivate({ variables: { id } });
    }
  };
  const buttonLabel = isActive ? buttonMessages.disableLabel : buttonMessages.enableLabel;

  return (
    <ButtonWithLoader
      variant="secondary"
      data-test-id="enable-button"
      onClick={handleClick}
      transitionState={currentOpts?.status}
    >
      {intl.formatMessage(currentOpts?.status === "error" ? commonMessages.error : buttonLabel)}
    </ButtonWithLoader>
  );
};
