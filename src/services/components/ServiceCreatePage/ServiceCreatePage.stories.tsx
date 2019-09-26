import { storiesOf } from "@storybook/react";
import React from "react";

import { permissions } from "@saleor/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { formError } from "@saleor/storybook/misc";
import ServiceCreatePage, { ServiceCreatePageProps } from "./ServiceCreatePage";

const props: ServiceCreatePageProps = {
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onSubmit: () => undefined,
  permissions,
  saveButtonBarState: "default"
};
storiesOf("Views / Services / Create service", module)
  .addDecorator(Decorator)
  .add("default", () => <ServiceCreatePage {...props} />)
  .add("loading", () => <ServiceCreatePage {...props} disabled={true} />)
  .add("form errors", () => (
    <ServiceCreatePage
      {...props}
      errors={["name"].map(field => formError(field))}
    />
  ));
