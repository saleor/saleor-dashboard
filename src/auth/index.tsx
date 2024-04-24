import { parse as parseQs } from "qs";
import React, { useContext } from "react";
import { Route, RouteComponentProps, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import { UserContext as Context } from "./types";
import {
  LoginUrlQueryParams,
  newPasswordPath,
  passwordResetPath,
  passwordResetSuccessPath,
} from "./urls";
import LoginViewComponent from "./views/Login";
import NewPassword from "./views/NewPassword";
import ResetPassword from "./views/ResetPassword";
import ResetPasswordSuccess from "./views/ResetPasswordSuccess";

const LoginView: React.FC<RouteComponentProps<any>> = () => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: LoginUrlQueryParams = qs;

  return <LoginViewComponent params={params} />;
};

export const UserContext = React.createContext<Context>({
  login: undefined,
  loginByExternalPlugin: undefined,
  logout: undefined,
  requestLoginByExternalPlugin: undefined,
  authenticating: false,
  authenticated: false,
  errors: [],
  refetchUser: undefined,
});

const AuthRouter: React.FC = () => (
  <Layout>
    <Routes>
      <Route path={passwordResetSuccessPath} element={ResetPasswordSuccess} />
      <Route path={passwordResetPath} element={ResetPassword} />
      <Route path={newPasswordPath} element={NewPassword} />
      <Route element={LoginView} />
    </Routes>
  </Layout>
);

AuthRouter.displayName = "AuthRouter";
export default AuthRouter;

export * from "./utils";
export const useUser = () => useContext(UserContext);
