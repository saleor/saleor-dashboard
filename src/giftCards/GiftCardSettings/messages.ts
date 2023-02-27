// @ts-strict-ignore
import { GiftCardSettingsErrorFragment } from "@dashboard/graphql";
import { getCommonFormFieldErrorMessage } from "@dashboard/utils/errors/common";
import { defineMessages, IntlShape } from "react-intl";

export const giftCardSettingsPageMessages = defineMessages({
  title: {
    id: "xHj9Qe",
    defaultMessage: "Gift Cards Settings",
    description: "gift card settings header",
  },
});

export function getGiftCardSettingsErrorMessage(
  error: Omit<GiftCardSettingsErrorFragment, "__typename"> | undefined,
  intl: IntlShape,
): string {
  return getCommonFormFieldErrorMessage(error, intl);
}
