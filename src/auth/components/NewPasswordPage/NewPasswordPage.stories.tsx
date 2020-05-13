import CardDecorator from "@saleor/storybook//CardDecorator";
import Decorator from "@saleor/storybook//Decorator";
import { AccountErrorCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import NewPasswordPage from "./NewPasswordPage";

storiesOf("Views / Authentication / Set up a new password", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("default", () => (
    <NewPasswordPage errors={[]} disabled={false} onSubmit={() => undefined} />
  ))
  .add("loading", () => (
    <NewPasswordPage errors={[]} disabled={true} onSubmit={() => undefined} />
  ))
  .add("too short error", () => (
    <NewPasswordPage
      errors={["password"].map(field => ({
        __typename: "AccountError",
        code: AccountErrorCode.PASSWORD_TOO_SHORT,
        field
      }))}
      disabled={false}
      onSubmit={() => undefined}
    />
  ));
