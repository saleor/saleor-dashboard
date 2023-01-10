import { ProductErrorCode } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import CategoryCreatePage, {
  CategoryCreatePageProps,
} from "./CategoryCreatePage";

const createProps: CategoryCreatePageProps = {
  backUrl: "",
  disabled: false,
  errors: [],
  onSubmit: () => undefined,
  saveButtonBarState: "default",
};

storiesOf("Categories / Create category", module)
  .addDecorator(Decorator)
  .add("default", () => <CategoryCreatePage {...createProps} />)
  .add("When loading", () => (
    <CategoryCreatePage {...createProps} disabled={true} />
  ))
  .add("form errors", () => (
    <CategoryCreatePage
      {...createProps}
      errors={[
        {
          code: ProductErrorCode.REQUIRED,
          field: "name",
          message: "Product field name required",
        },
        {
          code: ProductErrorCode.REQUIRED,
          field: "description",
          message: "Product field description required",
        },
      ].map(err => ({
        __typename: "ProductError",
        ...err,
      }))}
    />
  ));
