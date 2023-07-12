// @ts-strict-ignore
import { listActionsProps } from "@dashboard/fixtures";
import { PageErrorCode } from "@dashboard/graphql";
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

export default {
  title: "Page types / Page type details",
};

export const Default = () => <PageTypeDetailsPage {...props} />;

export const Loading = () => (
  <PageTypeDetailsPage
    {...props}
    disabled={true}
    pageTitle={undefined}
    pageType={undefined}
  />
);

export const FormErrors = () => (
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
);
