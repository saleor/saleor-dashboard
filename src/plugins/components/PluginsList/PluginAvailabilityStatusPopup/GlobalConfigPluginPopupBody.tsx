import { CardContent, Typography } from "@material-ui/core";
import CardSpacer from "@saleor/components/CardSpacer";
import { PluginBaseFragment } from "@saleor/graphql";
import { Pill } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import {
  globalConfigPluginMessages as messages,
  pluginStatusMessages,
} from "../messages";

interface GlobalConfigPluginPopupBodyProps {
  plugin: PluginBaseFragment;
}

const GlobalConfigPluginPopupBody: React.FC<GlobalConfigPluginPopupBodyProps> = ({
  plugin,
}) => {
  const intl = useIntl();

  const { active } = plugin.globalConfiguration;

  return (
    <>
      <CardContent>
        <Typography>{intl.formatMessage(messages.title)}</Typography>
        <CardSpacer />
        <Typography variant="caption">
          {intl.formatMessage(messages.description)}
        </Typography>
        <CardSpacer />
        <Pill
          color={active ? "success" : "error"}
          label={intl.formatMessage(
            active
              ? pluginStatusMessages.active
              : pluginStatusMessages.deactivated,
          )}
        />
      </CardContent>
    </>
  );
};

export default GlobalConfigPluginPopupBody;
