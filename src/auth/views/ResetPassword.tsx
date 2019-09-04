import React from "react";
import { useIntl } from "react-intl";
import urlJoin from "url-join";

import { APP_MOUNT_URI } from "@saleor/config";
import useNavigator from "@saleor/hooks/useNavigator";
import { commonMessages } from "@saleor/intl";
import ResetPasswordPage, {
  ResetPasswordPageFormData
} from "../components/ResetPasswordPage";
import { RequestPasswordResetMutation } from "../mutations";
import { RequestPasswordReset } from "../types/RequestPasswordReset";
import { newPasswordUrl, passwordResetSuccessUrl } from "../urls";

const ResetPasswordView: React.FC = () => {
  const [error, setError] = React.useState<string>();
  const navigate = useNavigator();
  const intl = useIntl();

  const handleRequestPasswordReset = (data: RequestPasswordReset) => {
    if (data.requestPasswordReset.errors.length === 0) {
      navigate(passwordResetSuccessUrl);
    } else {
      if (data.requestPasswordReset.errors.find(err => err.field === "email")) {
        setError(
          intl.formatMessage({
            defaultMessage:
              "Provided email address does not exist in our database."
          })
        );
      } else {
        setError(intl.formatMessage(commonMessages.somethingWentWrong));
      }
    }
  };

  return (
    <RequestPasswordResetMutation onCompleted={handleRequestPasswordReset}>
      {(requestPasswordReset, requestPasswordResetOpts) => {
        const handleSubmit = (data: ResetPasswordPageFormData) =>
          requestPasswordReset({
            variables: {
              email: data.email,
              redirectUrl: urlJoin(
                window.location.origin,
                APP_MOUNT_URI === "/" ? "" : APP_MOUNT_URI,
                newPasswordUrl().replace(/\?/, "")
              )
            }
          });

        return (
          <ResetPasswordPage
            disabled={requestPasswordResetOpts.loading}
            error={error}
            onSubmit={handleSubmit}
          />
        );
      }}
    </RequestPasswordResetMutation>
  );
};
ResetPasswordView.displayName = "ResetPasswordView";
export default ResetPasswordView;
