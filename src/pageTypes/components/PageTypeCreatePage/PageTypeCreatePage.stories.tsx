import { PageErrorCode } from "@saleor/graphql";
import React from "react";

import Decorator from "../../../storybook/Decorator";
import PageTypeCreatePage, { PageTypeCreatePageProps } from ".";

const props: Omit<PageTypeCreatePageProps, "classes"> = {
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onSubmit: () => undefined,
  saveButtonBarState: "default"
};

export default {
  title: "Views / Page types / Create page type",
  decorators: [Decorator]
};

export const Default = () => <PageTypeCreatePage {...props} />;

Default.story = {
  name: "default"
};

export const Loading = () => <PageTypeCreatePage {...props} disabled={true} />;

Loading.story = {
  name: "loading"
};

export const FormErrors = () => (
  <PageTypeCreatePage
    {...props}
    errors={[
      {
        code: PageErrorCode.REQUIRED,
        field: "name",
        message: "Field is required"
      }
    ].map(err => ({
      __typename: "PageError",
      ...err
    }))}
  />
);

FormErrors.story = {
  name: "form errors"
};
