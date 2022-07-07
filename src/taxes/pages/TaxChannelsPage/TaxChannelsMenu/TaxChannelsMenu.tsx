import { Card } from "@material-ui/core";
import ListItemLink from "@saleor/components/ListItemLink";
import Skeleton from "@saleor/components/Skeleton";
import { TaxConfigurationFragment } from "@saleor/graphql";
import { List, ListHeader, ListItem, ListItemCell } from "@saleor/macaw-ui";
import { taxesMessages } from "@saleor/taxes/messages";
import { taxConfigurationListUrl } from "@saleor/taxes/urls";
import clsx from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

import { useStyles } from "./styles";

interface TaxChannelsMenuProps {
  configurations: TaxConfigurationFragment[] | undefined;
  selectedConfigurationId: string;
}

export const TaxChannelsMenu: React.FC<TaxChannelsMenuProps> = ({
  configurations,
  selectedConfigurationId,
}) => {
  const classes = useStyles();
  return (
    <Card>
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
              [classes.selected]: configuration.id === selectedConfigurationId,
            })}
            href={taxConfigurationListUrl(configuration.id)}
          >
            <ListItemCell className={classes.ellipsis}>
              {configuration.channel.name}
            </ListItemCell>
          </ListItemLink>
        )) ?? <Skeleton />}
      </List>
    </Card>
  );
};

export default TaxChannelsMenu;
