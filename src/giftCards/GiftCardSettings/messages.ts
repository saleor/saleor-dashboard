import { GiftCardSettingsErrorFragment } from "@saleor/fragments/types/GiftCardSettingsErrorFragment";
import { commonMessages } from "@saleor/intl";
import { GiftCardSettingsErrorCode } from "@saleor/types/globalTypes";
import commonErrorMessages from "@saleor/utils/errors/common";
import { defineMessages, IntlShape } from "react-intl";

export const giftCardSettingsPageMessages = defineMessages({
  title: {
    defaultMessage: "Gift Cards Settings",
    description: "header"
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
