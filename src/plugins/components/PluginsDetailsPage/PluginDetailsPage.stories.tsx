import { PluginErrorCode } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { plugin } from "../../fixtures";
import PluginsDetailsPage, {
  PluginDetailsPageFormData,
  PluginsDetailsPageProps,
} from "./PluginsDetailsPage";

const props: PluginsDetailsPageProps = {
  disabled: false,
  errors: [],
  onClear: () => undefined,
  onEdit: () => undefined,
  onSubmit: () => undefined,
  plugin,
  saveButtonBarState: "default",
  setSelectedChannelId: () => undefined,
};

storiesOf("Plugins / Plugin details", module)
  .addDecorator(Decorator)
  .add("default", () => <PluginsDetailsPage {...props} />)
  .add("loading", () => (
    <PluginsDetailsPage {...props} disabled={true} plugin={undefined} />
  ))
  .add("form errors", () => (
    <PluginsDetailsPage
      {...props}
      errors={[
        ...(["active", "Username or account", "Password or license"] as Array<
          keyof PluginDetailsPageFormData
        >).map(field => ({
          __typename: "PluginError" as "PluginError",
          code: PluginErrorCode.INVALID,
          field,
          message: "Plugin invalid",
        })),
        {
          __typename: "PluginError" as "PluginError",
          code: PluginErrorCode.PLUGIN_MISCONFIGURED,
          field: null,
          message: "Plugin missconfigured",
        },
      ]}
    />
  ))
  .add("not configurable", () => (
    <PluginsDetailsPage
      {...props}
      plugin={{
        ...plugin,
      }}
    />
  ));
