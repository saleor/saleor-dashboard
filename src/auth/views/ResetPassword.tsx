import { useRequestPasswordResetMutation } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { commonMessages } from "@dashboard/intl";
import { extractMutationErrors } from "@dashboard/misc";
import { useState } from "react";
import { useIntl } from "react-intl";

import ResetPasswordPage, { ResetPasswordPageFormData } from "../components/ResetPasswordPage";
import { passwordResetSuccessUrl } from "../urls";
import { getNewPasswordResetRedirectUrl } from "../utils";

const ResetPasswordView = () => {
  const [error, setError] = useState<string>();
  const navigate = useNavigator();
  const intl = useIntl();
  const [requestPasswordReset, requestPasswordResetOpts] = useRequestPasswordResetMutation({
    onCompleted: data => {
      if (data?.requestPasswordReset?.errors.length === 0) {
        navigate(passwordResetSuccessUrl);
      } else {
        setError(intl.formatMessage(commonMessages.somethingWentWrong));
      }
    },
  });
  const handleSubmit = (data: ResetPasswordPageFormData) =>
    extractMutationErrors(
      requestPasswordReset({
        variables: {
          email: data.email,
          redirectUrl: getNewPasswordResetRedirectUrl(),
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
