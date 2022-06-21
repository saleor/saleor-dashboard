import { PluginErrorCode } from "@saleor/graphql";
import { storiesOf } from "@storybook/react";
import React from "react";

import PluginsDetailsPage, {
  PluginDetailsPageFormData,
  PluginsDetailsPageProps,
} from "../../../plugins/components/PluginsDetailsPage";
import { plugin } from "../../../plugins/fixtures";
import Decorator from "../../Decorator";

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

storiesOf("Views / Plugins / Plugin details", module)
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
