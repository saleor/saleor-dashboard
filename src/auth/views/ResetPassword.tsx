import React from "react";
import urlJoin from "url-join";

import useNavigator from "@saleor/hooks/useNavigator";
import useShop from "@saleor/hooks/useShop";
import ResetPasswordPage, {
  ResetPasswordPageFormData
} from "../components/ResetPasswordPage";
import { RequestPasswordResetMutation } from "../mutations";
import { RequestPasswordReset } from "../types/RequestPasswordReset";
import { newPasswordUrl, passwordResetSuccessUrl } from "../urls";

const ResetPasswordView: React.FC = () => {
  const navigate = useNavigator();
  const shop = useShop();

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
              redirectUrl: urlJoin(shop.domain.url, newPasswordUrl())
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
