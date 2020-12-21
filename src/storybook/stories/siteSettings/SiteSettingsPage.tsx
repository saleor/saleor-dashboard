import { Omit } from "@material-ui/core";
import { ShopErrorCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import SiteSettingsPage, {
  SiteSettingsPageProps
} from "../../../siteSettings/components/SiteSettingsPage";
import { shop } from "../../../siteSettings/fixtures";
import Decorator from "../../Decorator";

const props: Omit<SiteSettingsPageProps, "classes"> = {
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onSubmit: () => undefined,
  saveButtonBarState: "default",
  shop
};

storiesOf("Views / Site settings / Page", module)
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
        "customerSetPasswordUrl"
      ].map(field => ({
        __typename: "ShopError",
        code: ShopErrorCode.INVALID,
        field
      }))}
    />
  ));
