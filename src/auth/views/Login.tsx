import React from "react";

import useNavigator from "@saleor/hooks/useNavigator";
import useUser from "@saleor/hooks/useUser";
import LoginPage, { FormData } from "../components/LoginPage";
import { passwordResetUrl } from "../urls";

const LoginView: React.FC = () => {
  const navigate = useNavigator();
  const { login, user, tokenAuthLoading } = useUser();

  const handleSubmit = (data: FormData) => login(data.email, data.password);

  return (
    <LoginPage
      error={user === null}
      disableLoginButton={tokenAuthLoading}
      onPasswordRecovery={() => navigate(passwordResetUrl)}
      onSubmit={handleSubmit}
    />
  );
};
LoginView.displayName = "LoginView";
export default LoginView;
