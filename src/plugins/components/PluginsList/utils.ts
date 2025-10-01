import { PluginConfigurationBaseFragment } from "@dashboard/graphql";
import { PillColor } from "@saleor/macaw-ui";
import { MessageDescriptor } from "react-intl";

import { pluginStatusMessages } from "./messages";

export const getPluginStatusLabel = (
  channelData: PluginConfigurationBaseFragment,
): MessageDescriptor =>
  channelData.active ? pluginStatusMessages.active : pluginStatusMessages.deactivated;
export const getPluginStatusColor = (channelData: PluginConfigurationBaseFragment): PillColor =>
  channelData.active ? "success" : "error";
