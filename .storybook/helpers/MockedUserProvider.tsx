import * as React from "react";
import { UserContext } from "../../src/auth";
import { adminUserPermissions } from "../../src/fixtures";
import { UserFragment } from "../../src/graphql";

export const MockedUserProvider: React.FC<{
  customPermissions?: UserFragment["userPermissions"];
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
        __typename: "User",
      },
      errors: [],
    }}
  >
    {children}
  </UserContext.Provider>
);
