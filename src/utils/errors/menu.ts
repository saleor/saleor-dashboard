import { MenuErrorFragment } from "@saleor/fragments/types/MenuErrorFragment";
import { IntlShape } from "react-intl";

import { getCommonFormFieldErrorMessage } from "./common";

function getMenuErrorMessage(
  err: Omit<MenuErrorFragment, "__typename"> | undefined,
  intl: IntlShape
): string {
  return getCommonFormFieldErrorMessage(err, intl);
}

export default getMenuErrorMessage;
