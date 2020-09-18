import { WebhookErrorFragment } from "@saleor/fragments/types/WebhookErrorFragment";
import { commonMessages } from "@saleor/intl";
import { WebhookErrorCode } from "@saleor/types/globalTypes";
import { IntlShape } from "react-intl";

import commonErrorMessages from "./common";

function getWebhookErrorMessage(
  err: Omit<WebhookErrorFragment, "__typename"> | undefined,
  intl: IntlShape
): string {
  if (err) {
    switch (err.code) {
      case WebhookErrorCode.GRAPHQL_ERROR:
        return intl.formatMessage(commonErrorMessages.graphqlError);
      case WebhookErrorCode.REQUIRED:
        return intl.formatMessage(commonMessages.requiredField);
      case WebhookErrorCode.INVALID:
        return intl.formatMessage(commonErrorMessages.invalid);
      default:
        return intl.formatMessage(commonErrorMessages.unknownError);
    }
  }

  return undefined;
}

export default getWebhookErrorMessage;
