import { GiftCardSettingsErrorFragment } from "@saleor/fragments/types/GiftCardSettingsErrorFragment";
import { getCommonFormFieldErrorMessage } from "@saleor/utils/errors/common";
import { defineMessages, IntlShape } from "react-intl";

export const giftCardSettingsPageMessages = defineMessages({
  title: {
    defaultMessage: "Gift Cards Settings",
    description: "gift card settings header"
  }
});

export function getGiftCardSettingsErrorMessage(
  error: Omit<GiftCardSettingsErrorFragment, "__typename"> | undefined,
  intl: IntlShape
): string {
  return getCommonFormFieldErrorMessage(error, intl);
}
