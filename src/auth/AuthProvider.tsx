import { useApolloClient } from "@apollo/client";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { type PropsWithChildren } from "react";
import { useIntl } from "react-intl";

import { useAuthProvider } from "./hooks/useAuthProvider";
import { UserContext } from "./useUser";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const apolloClient = useApolloClient();
  const intl = useIntl();
  const notify = useNotifier();
  const authProvider = useAuthProvider({ intl, notify, apolloClient });

  return <UserContext.Provider value={authProvider}>{children}</UserContext.Provider>;
};

export default AuthProvider;
