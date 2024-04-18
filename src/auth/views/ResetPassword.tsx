import { useRequestPasswordResetMutation } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { commonMessages } from "@dashboard/intl";
import { extractMutationErrors } from "@dashboard/misc";
import { getAppMountUriForRedirect } from "@dashboard/utils/urls";
import React from "react";
import { useIntl } from "react-intl";
import urlJoin from "url-join";

import ResetPasswordPage, { ResetPasswordPageFormData } from "../components/ResetPasswordPage";
import { newPasswordUrl, passwordResetSuccessUrl } from "../urls";

const ResetPasswordView: React.FC = () => {
  const [error, setError] = React.useState<string>();
  const navigate = useNavigator();
  const intl = useIntl();
  const [requestPasswordReset, requestPasswordResetOpts] = useRequestPasswordResetMutation({
    onCompleted: data => {
      if (data?.requestPasswordReset?.errors.length === 0) {
        navigate(passwordResetSuccessUrl);
      } else {
        if (data?.requestPasswordReset?.errors.find(err => err.field === "email")) {
          setError(
            intl.formatMessage({
              id: "C0JLNW",
              defaultMessage: "Provided email address does not exist in our database.",
            }),
          );
        } else {
          setError(intl.formatMessage(commonMessages.somethingWentWrong));
        }
      }
    },
  });
  const handleSubmit = (data: ResetPasswordPageFormData) =>
    extractMutationErrors(
      requestPasswordReset({
        variables: {
          email: data.email,
          redirectUrl: urlJoin(
            window.location.origin,
            getAppMountUriForRedirect(),
            newPasswordUrl().replace(/\?/, ""),
          ),
        },
      }),
    );

  return (
    <ResetPasswordPage
      disabled={requestPasswordResetOpts.loading}
      error={error as string}
      onSubmit={handleSubmit}
    />
  );
};
ResetPasswordView.displayName = "ResetPasswordView";
export default ResetPasswordView;
