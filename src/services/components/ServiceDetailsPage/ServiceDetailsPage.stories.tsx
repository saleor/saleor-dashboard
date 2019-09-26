import { storiesOf } from "@storybook/react";
import React from "react";

import { permissions } from "@saleor/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { formError } from "@saleor/storybook/misc";
import { service } from "../../fixtures";
import ServiceDetailsPage, {
  ServiceDetailsPageProps
} from "./ServiceDetailsPage";

const props: ServiceDetailsPageProps = {
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onDelete: () => undefined,
  onSubmit: () => undefined,
  onTokenCreate: () => undefined,
  onTokenDelete: () => undefined,
  permissions,
  saveButtonBarState: "default",
  service
};
storiesOf("Views / Services / Service details", module)
  .addDecorator(Decorator)
  .add("default", () => <ServiceDetailsPage {...props} />)
  .add("loading", () => (
    <ServiceDetailsPage {...props} service={undefined} disabled={true} />
  ))
  .add("form errors", () => (
    <ServiceDetailsPage
      {...props}
      errors={["name"].map(field => formError(field))}
    />
  ));
