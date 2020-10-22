import { Omit } from "@material-ui/core";
import { formError } from "@saleor/storybook/misc";
import { storiesOf } from "@storybook/react";
import React from "react";

import PageTypeCreatePage, {
  PageTypeCreatePageProps,
  PageTypeForm
} from "../../../pageTypes/components/PageTypeCreatePage";
import Decorator from "../../Decorator";

const props: Omit<PageTypeCreatePageProps, "classes"> = {
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onSubmit: () => undefined,
  pageTitle: "Create page type",
  saveButtonBarState: "default"
};

storiesOf("Views / Page types / Create page type", module)
  .addDecorator(Decorator)
  .add("default", () => <PageTypeCreatePage {...props} />)
  .add("loading", () => (
    <PageTypeCreatePage {...props} disabled={true} pageTitle={undefined} />
  ))
  .add("form errors", () => (
    <PageTypeCreatePage
      {...props}
      errors={(["name"] as Array<keyof PageTypeForm>).map(formError)}
    />
  ));
