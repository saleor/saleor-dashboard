import { Omit } from "@material-ui/core";
import { PageErrorCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "../../../storybook/Decorator";
import PageTypeCreatePage, { PageTypeCreatePageProps } from ".";

const props: Omit<PageTypeCreatePageProps, "classes"> = {
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onSubmit: () => undefined,
  pageTitle: "Create page type",
  saveButtonBarState: "default"
};

storiesOf("Views / Page types / Create page type", module)
  .addDecorator(Decorator)
  .add("default", () => <PageTypeCreatePage {...props} />)
  .add("loading", () => (
    <PageTypeCreatePage {...props} disabled={true} pageTitle={undefined} />
  ))
  .add("form errors", () => (
    <PageTypeCreatePage
      {...props}
      errors={[
        {
          code: PageErrorCode.REQUIRED,
          field: "name"
        }
      ].map(err => ({
        __typename: "PageError",
        ...err
      }))}
    />
  ));
