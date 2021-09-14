import { GiftCardError } from "@saleor/fragments/types/GiftCardError";
import { GiftCardErrorCode } from "@saleor/types/globalTypes";
import { getCommonFormFieldErrorMessage } from "@saleor/utils/errors/common";
import { defineMessages, IntlShape } from "react-intl";

export const giftCardUpdateDetailsCardMessages = defineMessages({
  title: {
    defaultMessage: "Details",
    description: "GiftCardUpdateDetailsCard title"
  }
});

const giftCardErrorMessages = defineMessages({
  notFound: {
    defaultMessage: "Couldn't find gift card",
    description: "giftCardErrorMessages not found"
  }
});

export function getGiftCardErrorMessage(
  error: Omit<GiftCardError, "__typename"> | undefined,
  intl: IntlShape
): string {
  if (error) {
    switch (error.code) {
      case GiftCardErrorCode.NOT_FOUND:
        return intl.formatMessage(giftCardErrorMessages.notFound);
    }
  }

  return getCommonFormFieldErrorMessage(error, intl);
}
