// @ts-strict-ignore
import { PluginErrorCode } from "@dashboard/graphql";
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

export default {
  title: "Plugins / Plugin details",
};

export const Default = () => <PluginsDetailsPage {...props} />;

export const Loading = () => (
  <PluginsDetailsPage {...props} disabled={true} plugin={undefined} />
);

export const FormErrors = () => (
  <PluginsDetailsPage
    {...props}
    errors={[
      ...(
        ["active", "Username or account", "Password or license"] as Array<
          keyof PluginDetailsPageFormData
        >
      ).map(field => ({
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
);

export const NotConfigurable = () => (
  <PluginsDetailsPage
    {...props}
    plugin={{
      ...plugin,
    }}
  />
);
