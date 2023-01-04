import { PageErrorCode } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import PageTypeCreatePage, {
  PageTypeCreatePageProps,
} from "./PageTypeCreatePage";

const props: Omit<PageTypeCreatePageProps, "classes"> = {
  disabled: false,
  errors: [],
  onSubmit: () => undefined,
  saveButtonBarState: "default",
};

storiesOf("Page types / Create page type", module)
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
