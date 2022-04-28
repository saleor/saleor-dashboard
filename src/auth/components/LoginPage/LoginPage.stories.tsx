import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import LoginPage, { LoginCardProps } from "../../../auth/components/LoginPage";

const props: Omit<LoginCardProps, "classes"> = {
  disabled: false,
  externalAuthentications: [
    {
      __typename: "ExternalAuthentication",
      id: "auth.plugin.example",
      name: "Example auth plugin"
    }
  ],
  loading: false,
  onExternalAuthentication: () => undefined,
  onPasswordRecovery: undefined,
  onSubmit: () => undefined
};

export default {
  title: "Views / Authentication / Log in",
  decorators: [CardDecorator, Decorator]
};

export const Default = () => <LoginPage {...props} />;

Default.story = {
  name: "default"
};

export const ErrorLogin = () => <LoginPage {...props} error={"loginError"} />;

ErrorLogin.story = {
  name: "error login"
};

export const ErrorExternalLogin = () => (
  <LoginPage {...props} error={"externalLoginError"} />
);

ErrorExternalLogin.story = {
  name: "error external login"
};

export const Disabled = () => <LoginPage {...props} disabled={true} />;

Disabled.story = {
  name: "disabled"
};

export const Loading = () => <LoginPage {...props} loading={true} />;

Loading.story = {
  name: "loading"
};
