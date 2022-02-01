import { CardContent, Divider, Typography } from "@material-ui/core";
import CardSpacer from "@saleor/components/CardSpacer";
import CollectionWithDividers from "@saleor/components/CollectionWithDividers";
import StatusLabel from "@saleor/components/StatusLabel";
import { statusLabelMessages } from "@saleor/components/StatusLabel/messages";
import { PluginBaseFragment } from "@saleor/fragments/types/PluginBaseFragment";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { channelConfigPluginMessages as messages } from "../messages";
import {
  getActiveChannelConfigsCount,
  getAllChannelConfigsCount
} from "../utils";
import ScrollableContent from "./ScrollableContent";

const useStyles = makeStyles(
  theme => ({
    itemContainer: {
      padding: theme.spacing(0, 4)
    }
  }),
  { name: "ChannelConfigPluginPopupBody" }
);

interface ChannelConfigPluginPopupBodyProps {
  plugin: PluginBaseFragment;
}

const ChannelConfigPluginPopupBody: React.FC<ChannelConfigPluginPopupBodyProps> = ({
  plugin: { channelConfigurations }
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <>
      <CardContent>
        <Typography>
          {intl.formatMessage(messages.title, {
            allChannelsCount: getAllChannelConfigsCount(channelConfigurations),
            activeChannelsCount: getActiveChannelConfigsCount(
              channelConfigurations
            )
          })}
        </Typography>
      </CardContent>
      <Divider />
      <ScrollableContent>
        <CardSpacer />
        <CollectionWithDividers
          collection={channelConfigurations}
          DividerComponent={CardSpacer}
          renderItem={({ channel, active }) => (
            <div className={classes.itemContainer}>
              <StatusLabel
                key={channel.id}
                label={channel.name}
                status={active ? "success" : "error"}
                subtitle={intl.formatMessage(
                  active
                    ? statusLabelMessages.active
                    : statusLabelMessages.inactive
                )}
              />
            </div>
          )}
        />
        <CardSpacer />
      </ScrollableContent>
    </>
  );
};

export default ChannelConfigPluginPopupBody;
