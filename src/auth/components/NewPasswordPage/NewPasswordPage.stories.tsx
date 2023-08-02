// @ts-strict-ignore
import { AccountErrorCode } from "@dashboard/graphql";
import React from "react";

import { CardDecorator } from "../../../../.storybook/decorators";
import NewPasswordPage from "./NewPasswordPage";

export default {
  title: "Authentication / Set up a new password",
  decorators: [CardDecorator],
};

export const Default = () => (
  <NewPasswordPage errors={[]} loading={false} onSubmit={() => undefined} />
);

export const Loading = () => (
  <NewPasswordPage errors={[]} loading={true} onSubmit={() => undefined} />
);

export const TooShortError = () => (
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
);
