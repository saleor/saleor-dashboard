import { fetchMoreProps } from "@saleor/fixtures";
import { PageData } from "@saleor/pages/components/PageDetailsPage/form";
import { PageErrorCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import PageDetailsPage, {
  PageDetailsPageProps
} from "../../../pages/components/PageDetailsPage";
import { page } from "../../../pages/fixtures";
import Decorator from "../../Decorator";

const props: PageDetailsPageProps = {
  errors: [],
  loading: false,
  onAssignReferencesClick: () => undefined,
  onBack: () => undefined,
  onCloseDialog: () => undefined,
  onRemove: () => undefined,
  onSubmit: () => undefined,
  page,
  referencePages: [],
  referenceProducts: [],
  attributeValues: [],
  saveButtonBarState: "default",
  fetchAttributeValues: () => undefined,
  fetchMoreAttributeValues: fetchMoreProps
};

storiesOf("Views / Pages / Page details", module)
  .addDecorator(Decorator)
  .add("default", () => <PageDetailsPage {...props} />)
  .add("loading", () => (
    <PageDetailsPage {...props} loading={true} page={undefined} />
  ))
  .add("form errors", () => (
    <PageDetailsPage
      {...props}
      errors={([
        "title",
        "slug",
        "content",
        "publicationDate",
        "isPublished",
        "seoDescription",
        "seoTitle"
      ] as Array<keyof PageData>).map(field => ({
        __typename: "PageError",
        attributes: [],
        code: PageErrorCode.INVALID,
        field
      }))}
    />
  ));
