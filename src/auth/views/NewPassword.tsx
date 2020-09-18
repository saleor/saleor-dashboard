import useNavigator from "@saleor/hooks/useNavigator";
import useUser from "@saleor/hooks/useUser";
import { parse as parseQs } from "qs";
import React from "react";
import { RouteComponentProps } from "react-router";

import NewPasswordPage, {
  NewPasswordPageFormData
} from "../components/NewPasswordPage";
import { SetPasswordMutation } from "../mutations";
import { SetPassword } from "../types/SetPassword";
import { NewPasswordUrlQueryParams } from "../urls";

const NewPassword: React.FC<RouteComponentProps> = ({ location }) => {
  const navigate = useNavigator();
  const { loginByToken } = useUser();

  const params: NewPasswordUrlQueryParams = parseQs(location.search.substr(1));

  const handleSetPassword = async (data: SetPassword) => {
    if (data.setPassword.errors.length === 0) {
      loginByToken(
        data.setPassword.token,
        data.setPassword.csrfToken,
        data.setPassword.user
      );
      navigate("/", true);
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
            errors={setPasswordOpts.data?.setPassword.errors || []}
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
