import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import { AuthNotice } from "./AuthNotice/AuthNotice";

export const ChangingPasswordWarning = (): ReactNode => {
  const intl = useIntl();

  return (
    <AuthNotice tone="warning">
      {intl.formatMessage({
        defaultMessage:
          "You are currently logged in using an external identity provider. Logging in through email and password may result in loss of permissions and may render you incapable of managing the store. If you experience trouble authenticating, go back and contact your organization's administrator for assistance.",
        id: "hrhqju",
      })}
    </AuthNotice>
  );
};

ChangingPasswordWarning.displayName = "ChangingPasswordWarning";
