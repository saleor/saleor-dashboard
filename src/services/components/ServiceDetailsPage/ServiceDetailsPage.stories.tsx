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
  apiUri: "https://example.com/graphql/",
  disabled: false,
  errors: [],
  onApiUriClick: () => undefined,
  onBack: () => undefined,
  onDelete: () => undefined,
  onSubmit: () => undefined,
  onTokenClose: () => undefined,
  onTokenCreate: () => undefined,
  onTokenDelete: () => undefined,
  permissions,
  saveButtonBarState: "default",
  service,
  token: null
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
  ))
  .add("default token", () => (
    <ServiceDetailsPage {...props} token="93B4AF3D7E9FD7C61C4C9B32FF82F" />
  ));
