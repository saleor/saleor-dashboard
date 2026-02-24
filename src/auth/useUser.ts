import { createContext, useContext } from "react";

import { type UserContext as Context } from "./types";

export const UserContext = createContext<Context>({
  login: undefined,
  loginByExternalPlugin: undefined,
  logout: undefined,
  requestLoginByExternalPlugin: undefined,
  authenticating: false,
  isCredentialsLogin: false,
  authenticated: false,
  errors: [],
  refetchUser: undefined,
});

export const useUser = () => useContext(UserContext);
