import { listActionsProps } from "@dashboard/fixtures";
import { PageErrorCode } from "@dashboard/graphql";
import Decorator from "@dashboard/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { pageType } from "../../fixtures";
import PageTypeDetailsPage, {
  PageTypeDetailsPageProps,
} from "./PageTypeDetailsPage";

const props: Omit<PageTypeDetailsPageProps, "classes"> = {
  attributeList: listActionsProps,
  disabled: false,
  errors: [],
  onAttributeAdd: () => undefined,
  onAttributeReorder: () => undefined,
  onAttributeUnassign: () => undefined,
  onDelete: () => undefined,
  onSubmit: () => undefined,
  pageTitle: pageType.name,
  pageType,
  saveButtonBarState: "default",
};

storiesOf("Page types / Page type details", module)
  .addDecorator(Decorator)
  .add("default", () => <PageTypeDetailsPage {...props} />)
  .add("loading", () => (
    <PageTypeDetailsPage
      {...props}
      disabled={true}
      pageTitle={undefined}
      pageType={undefined}
    />
  ))
  .add("no attributes", () => (
    <PageTypeDetailsPage
      {...props}
      pageType={{
        ...pageType,
        attributes: [],
      }}
    />
  ))
  .add("form errors", () => (
    <PageTypeDetailsPage
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
