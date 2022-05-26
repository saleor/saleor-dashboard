import { Card } from "@material-ui/core";
import ListItemLink from "@saleor/components/ListItemLink";
import Skeleton from "@saleor/components/Skeleton";
import { TaxConfigurationFragment } from "@saleor/graphql";
import { List, ListHeader, ListItem, ListItemCell } from "@saleor/macaw-ui";
import { taxesMessages } from "@saleor/taxes/messages";
import { channelsListUrl } from "@saleor/taxes/urls";
import clsx from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

import { useStyles } from "./styles";

interface TaxChannelsMenuProps {
  configurations: TaxConfigurationFragment[];
  selectedConfigurationId: string;
}

export const TaxChannelsMenu: React.FC<TaxChannelsMenuProps> = ({
  configurations,
  selectedConfigurationId
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
          {configurations?.map(configuration => (
            <ListItemLink
              key={configuration.id}
              className={clsx(classes.clickable, {
                [classes.selected]: configuration.id === selectedConfigurationId
              })}
              href={channelsListUrl(configuration.id)}
            >
              <ListItemCell>{configuration.channel.name}</ListItemCell>
            </ListItemLink>
          )) ?? <Skeleton />}
        </List>
      </div>
    </Card>
  );
};

export default TaxChannelsMenu;
