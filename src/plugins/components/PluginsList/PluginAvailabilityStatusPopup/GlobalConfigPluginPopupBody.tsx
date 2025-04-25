// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import CardSpacer from "@dashboard/components/CardSpacer";
import { Pill } from "@dashboard/components/Pill";
import { PluginBaseFragment } from "@dashboard/graphql";
import { Text } from "@saleor/macaw-ui-next";
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
        <Text>{intl.formatMessage(messages.title)}</Text>
        <CardSpacer />
        <Text size={2} fontWeight="light">
          {intl.formatMessage(messages.description)}
        </Text>
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
