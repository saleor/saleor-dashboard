// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import CardSpacer from "@dashboard/components/CardSpacer";
import { Pill } from "@dashboard/components/Pill";
import { PluginBaseFragment } from "@dashboard/graphql";
import { Typography } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";

import { globalConfigPluginMessages as messages, pluginStatusMessages } from "../messages";

interface GlobalConfigPluginPopupBodyProps {
  plugin: PluginBaseFragment;
}

const GlobalConfigPluginPopupBody: React.FC<GlobalConfigPluginPopupBodyProps> = ({ plugin }) => {
  const intl = useIntl();
  const { active } = plugin.globalConfiguration;

  return (
    <>
      <DashboardCard.Content>
        <Typography>{intl.formatMessage(messages.title)}</Typography>
        <CardSpacer />
        <Typography variant="caption">{intl.formatMessage(messages.description)}</Typography>
        <CardSpacer />
        <Pill
          color={active ? "success" : "error"}
          label={intl.formatMessage(
            active ? pluginStatusMessages.active : pluginStatusMessages.deactivated,
          )}
        />
      </DashboardCard.Content>
    </>
  );
};

export default GlobalConfigPluginPopupBody;
