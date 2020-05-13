import { ProductErrorCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import CategoryCreatePage, {
  CategoryCreatePageProps
} from "../../../categories/components/CategoryCreatePage";
import Decorator from "../../Decorator";

const createProps: CategoryCreatePageProps = {
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onSubmit: () => undefined,
  saveButtonBarState: "default"
};

storiesOf("Views / Categories / Create category", module)
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
          field: "name"
        },
        {
          code: ProductErrorCode.REQUIRED,
          field: "descriptionJson"
        }
      ].map(err => ({
        __typename: "ProductError",
        ...err
      }))}
    />
  ));
