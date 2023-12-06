import { AccountErrorCode } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import React from "react";

import { CardDecorator } from "../../../../.storybook/decorators";
import NewPasswordPage from "./NewPasswordPage";

export default {
  title: "Authentication / Set up a new password",
  decorators: [CardDecorator],
};

const dummyPromise = () => undefined as unknown as SubmitPromise;

export const Default = () => (
  <NewPasswordPage errors={[]} loading={false} onSubmit={dummyPromise} />
);

export const Loading = () => (
  <NewPasswordPage errors={[]} loading={true} onSubmit={dummyPromise} />
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
    onSubmit={dummyPromise}
  />
);
