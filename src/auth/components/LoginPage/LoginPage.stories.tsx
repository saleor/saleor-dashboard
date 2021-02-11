import { Omit } from "@material-ui/core";
import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import LoginPage, { LoginCardProps } from "../../../auth/components/LoginPage";

const props: Omit<LoginCardProps, "classes"> = {
  disabled: false,
  error: false,
  externalAuthentications: [
    {
      __typename: "ExternalAuthentication",
      id: "auth.plugin.example",
      name: "Example auth plugin"
    }
  ],
  externalError: false,
  loading: false,
  onExternalAuthentication: () => undefined,
  onPasswordRecovery: undefined,
  onSubmit: () => undefined
};

storiesOf("Views / Authentication / Log in", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("default", () => <LoginPage {...props} />)
  .add("error", () => <LoginPage {...props} error={true} />)
  .add("disabled", () => <LoginPage {...props} disabled={true} />)
  .add("loading", () => <LoginPage {...props} loading={true} />);
