import { MenuErrorFragment } from "@saleor/fragments/types/MenuErrorFragment";
import { commonMessages } from "@saleor/intl";
import { MenuErrorCode } from "@saleor/types/globalTypes";
import { IntlShape } from "react-intl";

import commonErrorMessages from "./common";

function getMenuErrorMessage(
  err: Omit<MenuErrorFragment, "__typename"> | undefined,
  intl: IntlShape
): string {
  if (err) {
    switch (err.code) {
      case MenuErrorCode.GRAPHQL_ERROR:
        return intl.formatMessage(commonErrorMessages.graphqlError);
      case MenuErrorCode.REQUIRED:
        return intl.formatMessage(commonMessages.requiredField);
      case MenuErrorCode.INVALID:
        return intl.formatMessage(commonErrorMessages.invalid);
      default:
        return intl.formatMessage(commonErrorMessages.unknownError);
    }
  }

  return undefined;
}

export default getMenuErrorMessage;
