import { ProductErrorCode } from "@dashboard/graphql";
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

export default {
  title: "Categories / Create category",
};

export const Default = () => <CategoryCreatePage {...createProps} />;

export const WhenLoading = () => (
  <CategoryCreatePage {...createProps} disabled={true} />
);

export const FormErrors = () => (
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
);
