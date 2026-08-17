import { type GiftCardSettingsErrorFragment } from "@dashboard/graphql";
import { getCommonFormFieldErrorMessage } from "@dashboard/utils/errors/common";
import { type IntlShape } from "react-intl";

export function getGiftCardSettingsErrorMessage(
  error: Omit<GiftCardSettingsErrorFragment, "__typename"> | undefined,
  intl: IntlShape,
): string | undefined {
  return getCommonFormFieldErrorMessage(error, intl);
}
