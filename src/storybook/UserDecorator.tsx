import { UserContext } from "@saleor/auth";
import { UserFragment } from "@saleor/graphql";
import React from "react";

export const UserDecorator = (user: UserFragment) => storyFn => (
  <UserContext.Provider
    value={{
      login: undefined,
      requestLoginByExternalPlugin: undefined,
      loginByExternalPlugin: undefined,
      logout: undefined,
      user,
      authenticated: false,
      authenticating: false,
    }}
  >
    {storyFn()}
  </UserContext.Provider>
);
export default UserDecorator;
