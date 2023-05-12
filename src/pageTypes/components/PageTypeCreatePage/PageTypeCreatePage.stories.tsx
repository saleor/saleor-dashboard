import { PageErrorCode } from "@dashboard/graphql";
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

export default {
  title: "Page types / Create page type",
};

export const Default = () => <PageTypeCreatePage {...props} />;

export const Loading = () => <PageTypeCreatePage {...props} disabled={true} />;

export const FormErrors = () => (
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
);
