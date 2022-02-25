import { UserContext } from "@saleor/auth";
import { adminUserPermissions } from "@saleor/fixtures";
import { User_userPermissions } from "@saleor/fragments/types/User";
import * as React from "react";

export const MockedUserProvider: React.FC<{
  customPermissions?: User_userPermissions[];
}> = ({ customPermissions, children }) => (
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
        userPermissions: customPermissions ?? adminUserPermissions,
        avatar: null,
        __typename: "User"
      }
    }}
  >
    {children}
  </UserContext.Provider>
);
