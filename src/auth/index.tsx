import React from "react";
import { Route, Switch } from "react-router-dom";

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

const TOKEN_STORAGE_KEY = "dashboardAuth";

interface UserContext {
  login: (username: string, password: string, persist: boolean) => void;
  logout: () => void;
  tokenAuthLoading: boolean;
  tokenVerifyLoading: boolean;
  user?: User;
}

export const UserContext = React.createContext<UserContext>({
  login: undefined,
  logout: undefined,
  tokenAuthLoading: false,
  tokenVerifyLoading: false
});

export const getAuthToken = () =>
  localStorage.getItem(TOKEN_STORAGE_KEY) ||
  sessionStorage.getItem(TOKEN_STORAGE_KEY);

export const setAuthToken = (token: string, persist: boolean) =>
  persist
    ? localStorage.setItem(TOKEN_STORAGE_KEY, token)
    : sessionStorage.setItem(TOKEN_STORAGE_KEY, token);

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
};

const AuthRouter: React.FC = () => (
  <Switch>
    <Route path={passwordResetPath} component={ResetPassword} />
    <Route path={passwordResetSuccessPath} component={ResetPasswordSuccess} />
    <Route path={newPasswordPath} component={NewPassword} />
    <Route component={LoginView} />
  </Switch>
);

AuthRouter.displayName = "AuthRouter";
export default AuthRouter;
