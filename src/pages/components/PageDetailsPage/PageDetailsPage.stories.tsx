// @ts-strict-ignore
import { fetchMoreProps } from "@dashboard/fixtures";
import { PageErrorCode } from "@dashboard/graphql";
import { PageData } from "@dashboard/pages/components/PageDetailsPage/form";
import { page } from "@dashboard/pages/fixtures";
import React from "react";

import PageDetailsPage, { PageDetailsPageProps } from "./PageDetailsPage";

const props: PageDetailsPageProps = {
  errors: [],
  loading: false,
  onAssignReferencesClick: () => undefined,
  onCloseDialog: () => undefined,
  onRemove: () => undefined,
  onSubmit: () => undefined,
  page,
  referencePages: [],
  referenceProducts: [],
  attributeValues: [],
  saveButtonBarState: "default",
  fetchAttributeValues: () => undefined,
  onAttributeSelectBlur: () => undefined,
  fetchMoreAttributeValues: fetchMoreProps,
};

export default {
  title: "Pages / Page details",
};

export const Default = () => <PageDetailsPage {...props} />;

export const Loading = () => (
  <PageDetailsPage {...props} loading={true} page={undefined} />
);

export const FormErrors = () => (
  <PageDetailsPage
    {...props}
    errors={(
      [
        "title",
        "slug",
        "content",
        "publicationDate",
        "isPublished",
        "seoDescription",
        "seoTitle",
      ] as Array<keyof PageData>
    ).map(field => ({
      __typename: "PageError",
      attributes: [],
      code: PageErrorCode.INVALID,
      field,
      message: "Page field error",
    }))}
  />
);
