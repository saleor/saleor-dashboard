import { IMessageContext } from "@saleor/components/messages";
import { UseNotifierResult } from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { ApolloError } from "apollo-client";
import { IntlShape } from "react-intl";

import { isJwtError } from "./errors";

export const displayDemoMessage = (
  intl: IntlShape,
  notify: UseNotifierResult
) => {
  notify({
    text: intl.formatMessage(commonMessages.demo)
  });
};

export async function handleQueryAuthError(
  error: ApolloError,
  notify: IMessageContext,
  logout: () => void,
  intl: IntlShape
) {
  if (error.graphQLErrors.some(isJwtError)) {
    logout();
    notify({
      status: "error",
      text: intl.formatMessage(commonMessages.sessionExpired)
    });
  } else if (
    !error.graphQLErrors.every(
      err => err.extensions?.exception?.code === "PermissionDenied"
    )
  ) {
    notify({
      status: "error",
      text: intl.formatMessage(commonMessages.somethingWentWrong)
    });
  }
}
