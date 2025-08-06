// @ts-strict-ignore
import { PluginBaseFragment } from "@dashboard/graphql";
import { isPluginGlobal } from "@dashboard/plugins/views/utils";
import { TableCell } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

import { pluginChannelConfigurationCellMessages as messages } from "./messages";

interface PluginChannelConfigurationCellProps {
  plugin: PluginBaseFragment;
}

const PluginChannelConfigurationCell = ({ plugin }: PluginChannelConfigurationCellProps) => {
  const message = isPluginGlobal(plugin.globalConfiguration)
    ? messages.globalLabel
    : messages.channelLabel;

  return (
    <TableCell colSpan={2}>
      <FormattedMessage {...message} />
    </TableCell>
  );
};

export default PluginChannelConfigurationCell;
