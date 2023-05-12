import { ShopErrorCode } from "@dashboard/graphql";
import { shop } from "@dashboard/siteSettings/fixtures";
import React from "react";

import SiteSettingsPage, { SiteSettingsPageProps } from "./SiteSettingsPage";

const props: Omit<SiteSettingsPageProps, "classes"> = {
  disabled: false,
  errors: [],
  onSubmit: async () => undefined,
  saveButtonBarState: "default",
  shop,
};

export default {
  title: "Site settings / Page",
};

export const Default = () => <SiteSettingsPage {...props} />;

export const Loading = () => (
  <SiteSettingsPage {...props} disabled={true} shop={undefined} />
);

export const FormErrors = () => (
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
);
