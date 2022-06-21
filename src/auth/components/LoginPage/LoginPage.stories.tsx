import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import LoginPage, { LoginCardProps } from "../../../auth/components/LoginPage";

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
  onExternalAuthentication: () => undefined,
  onSubmit: () => undefined,
};

storiesOf("Views / Authentication / Log in", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("default", () => <LoginPage {...props} />)
  .add("error login", () => <LoginPage {...props} error={"loginError"} />)
  .add("error external login", () => (
    <LoginPage {...props} error={"externalLoginError"} />
  ))
  .add("disabled", () => <LoginPage {...props} disabled={true} />)
  .add("loading", () => <LoginPage {...props} loading={true} />);
