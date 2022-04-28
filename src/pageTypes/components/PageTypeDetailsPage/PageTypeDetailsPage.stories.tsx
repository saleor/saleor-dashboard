import { listActionsProps } from "@saleor/fixtures";
import { PageErrorCode } from "@saleor/graphql";
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

export default {
  title: "Views / Page types / Page type details",
  decorators: [Decorator]
};

export const Default = () => <PageTypeDetailsPage {...props} />;

Default.story = {
  name: "default"
};

export const Loading = () => (
  <PageTypeDetailsPage
    {...props}
    disabled={true}
    pageTitle={undefined}
    pageType={undefined}
  />
);

Loading.story = {
  name: "loading"
};

export const NoAttributes = () => (
  <PageTypeDetailsPage
    {...props}
    pageType={{
      ...pageType,
      attributes: []
    }}
  />
);

NoAttributes.story = {
  name: "no attributes"
};

export const FormErrors = () => (
  <PageTypeDetailsPage
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
