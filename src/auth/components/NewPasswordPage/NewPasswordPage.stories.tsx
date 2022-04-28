import { AccountErrorCode } from "@saleor/graphql";
import CardDecorator from "@saleor/storybook//CardDecorator";
import Decorator from "@saleor/storybook//Decorator";
import React from "react";

import NewPasswordPage from "./NewPasswordPage";

export default {
  title: "Views / Authentication / Set up a new password",
  decorators: [CardDecorator, Decorator]
};

export const Default = () => (
  <NewPasswordPage errors={[]} disabled={false} onSubmit={() => undefined} />
);

Default.story = {
  name: "default"
};

export const Loading = () => (
  <NewPasswordPage errors={[]} disabled={true} onSubmit={() => undefined} />
);

Loading.story = {
  name: "loading"
};

export const TooShortError = () => (
  <NewPasswordPage
    errors={["password"].map(field => ({
      __typename: "AccountError",
      code: AccountErrorCode.PASSWORD_TOO_SHORT,
      field,
      addressType: null,
      message: null
    }))}
    disabled={false}
    onSubmit={() => undefined}
  />
);

TooShortError.story = {
  name: "too short error"
};
