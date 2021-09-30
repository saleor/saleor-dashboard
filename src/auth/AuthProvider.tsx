import React, { useContext } from "react";

import { UserContext } from "./";
import { useAuthProvider } from "./hooks/useAuthProvider";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authProvider = useAuthProvider();

  return (
    <UserContext.Provider value={authProvider}>{children}</UserContext.Provider>
  );
};

export const useAuth = () => {
  const userContext = useContext(UserContext);

  return userContext;
};

export default AuthProvider;
