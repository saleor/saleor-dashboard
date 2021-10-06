import useNotifier from "@saleor/hooks/useNotifier";
import React, { useContext } from "react";
import { useIntl } from "react-intl";

import { UserContext } from "./";
import { useAuthProvider } from "./hooks/useAuthProvider";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const intl = useIntl();
  const notify = useNotifier();

  const authProvider = useAuthProvider({ intl, notify });

  return (
    <UserContext.Provider value={authProvider}>{children}</UserContext.Provider>
  );
};

export const useAuth = () => {
  const userContext = useContext(UserContext);

  return userContext;
};

export default AuthProvider;
