import { Omit } from "@material-ui/core";
import { listActionsProps } from "@saleor/fixtures";
import { PageErrorCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "../../../storybook/Decorator";
import { pageType } from "../../fixtures";
import PageTypeDetailsPage, { PageTypeDetailsPageProps } from ".";

const props: Omit<PageTypeDetailsPageProps, "classes"> = {
  attributeList: listActionsProps,
  disabled: false,
  errors: [],
  onAttributeAdd: () => undefined,
  onAttributeClick: () => undefined,
  onAttributeReorder: () => undefined,
  onAttributeUnassign: () => undefined,
  onBack: () => undefined,
  onDelete: () => undefined,
  onSubmit: () => undefined,
  pageTitle: pageType.name,
  pageType,
  saveButtonBarState: "default"
};

storiesOf("Views / Page types / Page type details", module)
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
        attributes: []
      }}
    />
  ))
  .add("form errors", () => (
    <PageTypeDetailsPage
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
