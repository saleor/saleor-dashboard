import { UserContext } from "@saleor/auth";
import { adminUserPermissions } from "@saleor/fixtures";
import * as React from "react";

export const ComponentWithMockContext: React.FC = ({ children }) => (
  <UserContext.Provider
    value={{
      login: undefined,
      loginByExternalPlugin: undefined,
      logout: undefined,
      requestLoginByExternalPlugin: undefined,
      authenticating: false,
      authenticated: false,
      user: {
        id: "0",
        email: "email@email.me",
        firstName: "user",
        lastName: "user",
        isStaff: true,
        userPermissions: adminUserPermissions,
        avatar: null,
        __typename: "User"
      }
    }}
  >
    {children}
  </UserContext.Provider>
);
