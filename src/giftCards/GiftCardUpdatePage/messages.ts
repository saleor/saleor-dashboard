import { commonMessages } from "@saleor/intl";
import { GiftCardErrorCode } from "@saleor/types/globalTypes";
import commonErrorMessages from "@saleor/utils/errors/common";
import { defineMessages, IntlShape } from "react-intl";

import { GiftCardUpdate_giftCardUpdate_errors } from "./types/GiftCardUpdate";

export const giftCardUpdateDetailsCardMessages = defineMessages({
  title: {
    defaultMessage: "Details",
    description: "GiftCardUpdateDetailsCard title"
  },
  setBalanceButtonLabel: {
    defaultMessage: "Set balance",
    description: "GiftCardUpdateDetailsCard set balance button label"
  },
  setBalanceDialogSubtitle: {
    defaultMessage:
      "What would you like to set cards balance to. When you change the balance both values will be changed",
    description: "GiftCardUpdateDetailsCard set balance dialog subtitle"
  },
  changeButtonLabel: {
    defaultMessage: "Change",
    description:
      "GiftCardUpdateDetailsCard set balance dialog change button label"
  }
});

export function getGiftCardErrorMessage(
  error: Omit<GiftCardUpdate_giftCardUpdate_errors, "__typename"> | undefined,
  intl: IntlShape
): string {
  if (error) {
    switch (error.code) {
      case GiftCardErrorCode.GRAPHQL_ERROR:
        return intl.formatMessage(commonErrorMessages.graphqlError);
      case GiftCardErrorCode.REQUIRED:
        return intl.formatMessage(commonMessages.requiredField);
      case GiftCardErrorCode.INVALID:
        return intl.formatMessage(commonErrorMessages.invalid);

      default:
        return intl.formatMessage(commonErrorMessages.unknownError);
    }
  }

  return undefined;
}
