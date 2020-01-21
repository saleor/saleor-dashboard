import React from "react";
import { Route, Switch } from "react-router-dom";

import Layout from "./components/Layout";
import { User } from "./types/User";
import {
  newPasswordPath,
  passwordResetPath,
  passwordResetSuccessPath
} from "./urls";
import LoginView from "./views/Login";
import NewPassword from "./views/NewPassword";
import ResetPassword from "./views/ResetPassword";
import ResetPasswordSuccess from "./views/ResetPasswordSuccess";
import LoginLoading from "./components/LoginLoading";

interface UserContext {
  login: (username: string, password: string) => void;
  loginByToken: (token: string, user: User) => void;
  logout: () => void;
  tokenAuthLoading: boolean;
  tokenVerifyLoading: boolean;
  user?: User;
}

export const UserContext = React.createContext<UserContext>({
  login: undefined,
  loginByToken: undefined,
  logout: undefined,
  tokenAuthLoading: false,
  tokenVerifyLoading: false
});

interface AuthRouterProps {
  hasToken: boolean;
}

const AuthRouter: React.FC<AuthRouterProps> = ({ hasToken }) => (
  <Layout>
    <Switch>
      <Route path={passwordResetSuccessPath} component={ResetPasswordSuccess} />
      <Route path={passwordResetPath} component={ResetPassword} />
      {!hasToken ? (
        <Route path={newPasswordPath} component={NewPassword} />
      ) : (
        <LoginLoading />
      )}
      <Route component={LoginView} />
    </Switch>
  </Layout>
);

AuthRouter.displayName = "AuthRouter";
export default AuthRouter;

export * from "./utils";
