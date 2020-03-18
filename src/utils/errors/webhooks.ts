import { IntlShape } from "react-intl";

import { WebhookErrorCode } from "@saleor/types/globalTypes";
import { commonMessages } from "@saleor/intl";
import { WebhookErrorFragment } from "@saleor/webhooks/types/WebhookErrorFragment";
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
