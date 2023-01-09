import { ShopErrorCode } from "@saleor/graphql";
import { shop } from "@saleor/siteSettings/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import SiteSettingsPage, { SiteSettingsPageProps } from "./SiteSettingsPage";

const props: Omit<SiteSettingsPageProps, "classes"> = {
  disabled: false,
  errors: [],
  onSubmit: () => undefined,
  saveButtonBarState: "default",
  shop,
};

storiesOf("Site settings / Page", module)
  .addDecorator(Decorator)
  .add("default", () => <SiteSettingsPage {...props} />)
  .add("loading", () => (
    <SiteSettingsPage {...props} disabled={true} shop={undefined} />
  ))
  .add("form errors", () => (
    <SiteSettingsPage
      {...props}
      errors={[
        "description",
        "domain",
        "name",
        "defaultMailSenderAddress",
        "defaultMailSenderName",
        "customerSetPasswordUrl",
      ].map(field => ({
        __typename: "ShopError",
        code: ShopErrorCode.INVALID,
        field,
        message: "Shop form invalid",
      }))}
    />
  ));
