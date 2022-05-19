import { Card } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import ListItemLink from "@saleor/components/ListItemLink";
import {
  List,
  ListHeader,
  ListItem,
  ListItemCell,
  makeStyles
} from "@saleor/macaw-ui";
import { taxesMessages } from "@saleor/taxes/messages";
import { channelsListUrl } from "@saleor/taxes/urls";
import clsx from "clsx";
import React from "react";
import { FormattedMessage } from "react-intl";

interface TaxChannelsMenuProps {
  channels: any;
  selectedChannelId: string;
}

const useStyles = makeStyles(
  theme => ({
    clickable: {
      cursor: "pointer"
    },
    scrollWrapper: {
      overflowY: "scroll",
      maxHeight: 600
    },
    selected: {
      borderLeft: `4px solid ${theme.palette.saleor.active[1]}`
    }
  }),
  { name: "TaxChannelsMenu" }
);

export const TaxChannelsMenu: React.FC<TaxChannelsMenuProps> = ({
  channels,
  selectedChannelId
}) => {
  const classes = useStyles();
  return (
    <Card>
      <div className={classes.scrollWrapper}>
        <List gridTemplate={["1fr"]}>
          <ListHeader>
            <ListItem>
              <ListItemCell>
                <FormattedMessage {...taxesMessages.channelList} />
              </ListItemCell>
            </ListItem>
          </ListHeader>
          {channels?.map(channel => (
            <ListItemLink
              key={channel.id}
              className={clsx(classes.clickable, {
                [classes.selected]: channel.id === selectedChannelId
              })}
              href={channelsListUrl(channel.id)}
            >
              <ListItemCell>{channel.name}</ListItemCell>
            </ListItemLink>
          )) ?? <Skeleton />}
        </List>
      </div>
    </Card>
  );
};

export default TaxChannelsMenu;
