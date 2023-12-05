import React from "react";

import { CardDecorator } from "../../../../.storybook/decorators";
import LoginPage, { LoginCardProps } from "./LoginPage";

const props: Omit<LoginCardProps, "classes"> = {
  disabled: false,
  externalAuthentications: [
    {
      __typename: "ExternalAuthentication",
      id: "auth.plugin.example",
      name: "Example auth plugin",
    },
  ],
  loading: false,
  errors: [],
  onExternalAuthentication: () => undefined,
  onSubmit: async () => {},
};

export default {
  title: "Authentication / Log in",
  decorators: [CardDecorator],
};

export const Default = () => <LoginPage {...props} />;

export const ErrorLogin = () => (
  <LoginPage {...props} errors={["loginError"]} />
);

export const ErrorExternalLogin = () => (
  <LoginPage {...props} errors={["externalLoginError"]} />
);

export const Disabled = () => <LoginPage {...props} disabled={true} />;

export const Loading = () => <LoginPage {...props} loading={true} />;
