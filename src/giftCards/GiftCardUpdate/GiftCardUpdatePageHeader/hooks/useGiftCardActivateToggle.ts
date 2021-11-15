import useNotifier from "@saleor/hooks/useNotifier";
import commonErrorMessages from "@saleor/utils/errors/common";
import { useIntl } from "react-intl";

import { GIFT_CARD_DETAILS_QUERY } from "../../queries";
import { giftCardEnableDisableSectionMessages as messages } from "../messages";
import {
  useGiftCardActivateMutation,
  useGiftCardDeactivateMutation
} from "../mutations";
import { GiftCardActivate } from "../types/GiftCardActivate";
import { GiftCardDeactivate } from "../types/GiftCardDeactivate";

interface useGiftCardActivateToggleProps {
  onActivateActionComplete?: () => void | undefined;
  onDeactivateActionComplete?: () => void | undefined;
  isActive?: boolean;
}

const useGiftCardActivateToggle = ({
  onActivateActionComplete,
  onDeactivateActionComplete,
  isActive
}: useGiftCardActivateToggleProps) => {
  const intl = useIntl();
  const notify = useNotifier();

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

    if (!!onActivateActionComplete) {
      onActivateActionComplete();
    }
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

    if (!!onDeactivateActionComplete) {
      onDeactivateActionComplete();
    }
  };

  const [giftCardActivate, giftCardActivateOpts] = useGiftCardActivateMutation({
    onCompleted: onActivateCompleted,
    refetchQueries: [GIFT_CARD_DETAILS_QUERY]
  });

  const [
    giftCardDeactivate,
    giftCardDeactivateOpts
  ] = useGiftCardDeactivateMutation({
    onCompleted: onDeactivateCompleted,
    refetchQueries: [GIFT_CARD_DETAILS_QUERY]
  });

  const currentOpts = isActive ? giftCardDeactivateOpts : giftCardActivateOpts;

  return {
    giftCardActivate,
    giftCardActivateOpts,
    giftCardDeactivate,
    giftCardDeactivateOpts,
    currentOpts
  };
};

export default useGiftCardActivateToggle;
