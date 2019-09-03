import React from "react";
import urlJoin from "url-join";

import { APP_MOUNT_URI } from "@saleor/config";
import useNavigator from "@saleor/hooks/useNavigator";
import ResetPasswordPage, {
  ResetPasswordPageFormData
} from "../components/ResetPasswordPage";
import { RequestPasswordResetMutation } from "../mutations";
import { RequestPasswordReset } from "../types/RequestPasswordReset";
import { newPasswordUrl, passwordResetSuccessUrl } from "../urls";

const ResetPasswordView: React.FC = () => {
  const navigate = useNavigator();

  const handleRequestPasswordReset = (data: RequestPasswordReset) => {
    if (data.requestPasswordReset.errors.length === 0) {
      navigate(passwordResetSuccessUrl);
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
                APP_MOUNT_URI,
                newPasswordUrl().replace(/\?/, "")
              )
            }
          });

        return (
          <ResetPasswordPage
            disabled={requestPasswordResetOpts.loading}
            onSubmit={handleSubmit}
          />
        );
      }}
    </RequestPasswordResetMutation>
  );
};
ResetPasswordView.displayName = "ResetPasswordView";
export default ResetPasswordView;
