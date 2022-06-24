import { PageErrorCode } from "@saleor/graphql";
import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "../../../storybook/Decorator";
import PageTypeCreatePage, { PageTypeCreatePageProps } from ".";

const props: Omit<PageTypeCreatePageProps, "classes"> = {
  disabled: false,
  errors: [],
  onSubmit: () => undefined,
  saveButtonBarState: "default",
};

storiesOf("Views / Page types / Create page type", module)
  .addDecorator(Decorator)
  .add("default", () => <PageTypeCreatePage {...props} />)
  .add("loading", () => <PageTypeCreatePage {...props} disabled={true} />)
  .add("form errors", () => (
    <PageTypeCreatePage
      {...props}
      errors={[
        {
          code: PageErrorCode.REQUIRED,
          field: "name",
          message: "Field is required",
        },
      ].map(err => ({
        __typename: "PageError",
        ...err,
      }))}
    />
  ));
