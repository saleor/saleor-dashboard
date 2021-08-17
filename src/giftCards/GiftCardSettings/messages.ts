import { GiftCardSettingsErrorFragment } from "@saleor/fragments/types/GiftCardSettingsErrorFragment";
import { commonMessages } from "@saleor/intl";
import { GiftCardSettingsErrorCode } from "@saleor/types/globalTypes";
import commonErrorMessages from "@saleor/utils/errors/common";
import { defineMessages, IntlShape } from "react-intl";

export const giftCardSettingsMessages = defineMessages({
  title: {
    defaultMessage: "Gift Cards Setting",
    description: "header"
  }
});

export const giftCardSettingsListMessages = defineMessages({
  expiryDateSectionDescription: {
    defaultMessage:
      "You can set gift cards to expire after a certain time after their purchase. Remember that in some countries, gift cards expiry is prohibited by law."
  },
  expiryDateTitle: {
    defaultMessage: "Expiry date",
    description: "section header"
  },
  setExpirationPeriodTitle: {
    defaultMessage: "Set gift card expiration period",
    description: "checkbox label"
  },
  setExpirationPeriodDescription: {
    defaultMessage:
      "Expiration date will be automatically set, once gift card is issued",
    description: "checkbox label description"
  }
});

export function getGiftCardSettingsErrorMessage(
  error: GiftCardSettingsErrorFragment | undefined,
  intl: IntlShape
): string {
  if (error) {
    switch (error.code) {
      case GiftCardSettingsErrorCode.GRAPHQL_ERROR:
        return intl.formatMessage(commonErrorMessages.graphqlError);
      case GiftCardSettingsErrorCode.REQUIRED:
        return intl.formatMessage(commonMessages.requiredField);
      case GiftCardSettingsErrorCode.INVALID:
        return intl.formatMessage(commonErrorMessages.invalid);

      default:
        return intl.formatMessage(commonErrorMessages.unknownError);
    }
  }

  return undefined;
}
