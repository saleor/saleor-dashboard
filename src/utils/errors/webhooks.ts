import { WebhookErrorFragment } from "@dashboard/graphql";
import { IntlShape } from "react-intl";

import { getCommonFormFieldErrorMessage } from "./common";

function getWebhookErrorMessage(
  err: Omit<WebhookErrorFragment, "__typename"> | undefined,
  intl: IntlShape,
): string | undefined {
  return getCommonFormFieldErrorMessage(err, intl);
}

export default getWebhookErrorMessage;
