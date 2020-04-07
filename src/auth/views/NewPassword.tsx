import { parse as parseQs } from "qs";
import React from "react";
import { RouteComponentProps } from "react-router";

import useNavigator from "@saleor/hooks/useNavigator";
import useUser from "@saleor/hooks/useUser";
import { useIntl } from "react-intl";
import { commonMessages } from "@saleor/intl";
import getAccountErrorMessage from "@saleor/utils/errors/account";
import NewPasswordPage, {
  NewPasswordPageFormData
} from "../components/NewPasswordPage";
import { SetPasswordMutation } from "../mutations";
import { SetPassword } from "../types/SetPassword";
import { NewPasswordUrlQueryParams } from "../urls";

const NewPassword: React.FC<RouteComponentProps> = ({ location }) => {
  const navigate = useNavigator();
  const { loginByToken } = useUser();
  const [error, setError] = React.useState<string>();
  const intl = useIntl();

  const params: NewPasswordUrlQueryParams = parseQs(location.search.substr(1));

  const handleSetPassword = async (data: SetPassword) => {
    if (data.setPassword.errors.length === 0) {
      loginByToken(data.setPassword.token, data.setPassword.user);
      navigate("/", true);
    } else {
      const error = data.setPassword.errors.find(
        err => err.field === "password"
      );
      if (error) {
        setError(getAccountErrorMessage(error, intl));
      } else {
        setError(intl.formatMessage(commonMessages.somethingWentWrong));
      }
    }
  };

  return (
    <SetPasswordMutation onCompleted={handleSetPassword}>
      {(setPassword, setPasswordOpts) => {
        const handleSubmit = (data: NewPasswordPageFormData) =>
          setPassword({
            variables: {
              email: params.email,
              password: data.password,
              token: params.token
            }
          });

        return (
          <NewPasswordPage
            error={error}
            disabled={setPasswordOpts.loading}
            onSubmit={handleSubmit}
          />
        );
      }}
    </SetPasswordMutation>
  );
};

NewPassword.displayName = "NewPassword";
export default NewPassword;
