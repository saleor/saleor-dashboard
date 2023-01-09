import { AccountErrorCode } from "@saleor/graphql";
import CardDecorator from "@saleor/storybook//CardDecorator";
import Decorator from "@saleor/storybook//Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import NewPasswordPage from "./NewPasswordPage";

storiesOf("Authentication / Set up a new password", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("default", () => (
    <NewPasswordPage errors={[]} loading={false} onSubmit={() => undefined} />
  ))
  .add("loading", () => (
    <NewPasswordPage errors={[]} loading={true} onSubmit={() => undefined} />
  ))
  .add("too short error", () => (
    <NewPasswordPage
      errors={["password"].map(field => ({
        __typename: "AccountError",
        code: AccountErrorCode.PASSWORD_TOO_SHORT,
        field,
        addressType: null,
        message: null,
      }))}
      loading={false}
      onSubmit={() => undefined}
    />
  ));
