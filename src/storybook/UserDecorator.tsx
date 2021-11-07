import { UserContext } from "@saleor/auth";
import { User } from "@saleor/fragments/types/User";
import React from "react";

export const UserDecorator = (user: User) => storyFn => (
  <UserContext.Provider
    value={{
      login: undefined,
      requestLoginByExternalPlugin: undefined,
      loginByExternalPlugin: undefined,
      logout: undefined,
      user,
      authenticated: false,
      authenticating: false
    }}
  >
    {storyFn()}
  </UserContext.Provider>
);
export default UserDecorator;
