import { Omit } from "@material-ui/core";
import { listActionsProps } from "@saleor/fixtures";
import { formError } from "@saleor/storybook/misc";
import { storiesOf } from "@storybook/react";
import React from "react";

import PageTypeDetailsPage, {
  PageTypeDetailsPageProps,
  PageTypeForm
} from "../../../pageTypes/components/PageTypeDetailsPage";
import { pageType } from "../../../pageTypes/fixtures";
import Decorator from "../../Decorator";

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
        pageAttributes: []
      }}
    />
  ))
  .add("form errors", () => (
    <PageTypeDetailsPage
      {...props}
      errors={(["name"] as Array<keyof PageTypeForm>).map(formError)}
    />
  ));
