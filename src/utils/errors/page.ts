import { commonMessages } from "@saleor/intl";
import { PageErrorFragment } from "@saleor/pages/types/PageErrorFragment";
import { PageErrorCode } from "@saleor/types/globalTypes";
import { IntlShape } from "react-intl";

import commonErrorMessages from "./common";

function getPageErrorMessage(
  err: Omit<PageErrorFragment, "__typename"> | undefined,
  intl: IntlShape
): string {
  if (err) {
    switch (err.code) {
      case PageErrorCode.GRAPHQL_ERROR:
        return intl.formatMessage(commonErrorMessages.graphqlError);
      case PageErrorCode.REQUIRED:
        return intl.formatMessage(commonMessages.requiredField);
      case PageErrorCode.INVALID:
        return intl.formatMessage(commonErrorMessages.invalid);
      default:
        return intl.formatMessage(commonErrorMessages.unknownError);
    }
  }

  return undefined;
}

export default getPageErrorMessage;
