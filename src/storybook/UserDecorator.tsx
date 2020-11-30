import { UserContext } from "@saleor/auth";
import { User } from "@saleor/fragments/types/User";
import React from "react";

export const UserDecorator = (user: User) => storyFn => (
  <UserContext.Provider
    value={{
      login: undefined,
      loginByToken: undefined,
      logout: undefined,
      tokenAuthLoading: false,
      tokenRefresh: undefined,
      tokenVerifyLoading: false,
      user
    }}
  >
    {storyFn()}
  </UserContext.Provider>
);
export default UserDecorator;
