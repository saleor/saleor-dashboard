import { Card, Divider } from "@material-ui/core";
import ListItemLink from "@saleor/components/ListItemLink";
import Skeleton from "@saleor/components/Skeleton";
import { TaxConfigurationFragment } from "@saleor/graphql";
import { List, ListHeader, ListItem, ListItemCell } from "@saleor/macaw-ui";
import { taxesMessages } from "@saleor/taxes/messages";
import { taxConfigurationListUrl } from "@saleor/taxes/urls";
import { isLastElement } from "@saleor/taxes/utils/utils";
import clsx from "clsx";
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
          <ListItem className={classes.tableRow}>
            <ListItemCell>
              <FormattedMessage {...taxesMessages.channelList} />
            </ListItemCell>
          </ListItem>
        </ListHeader>
        <Divider />
        {configurations?.map((configuration, confIndex) => (
          <React.Fragment key={configuration.id}>
            <ListItemLink
              className={clsx(classes.clickable, classes.tableRow, {
                [classes.selected]:
                  configuration.id === selectedConfigurationId,
              })}
              href={taxConfigurationListUrl(configuration.id)}
            >
              <ListItemCell className={classes.ellipsis}>
                {configuration.channel.name}
              </ListItemCell>
            </ListItemLink>
            {!isLastElement(configurations, confIndex) && <Divider />}
          </React.Fragment>
        )) ?? <Skeleton />}
      </List>
    </Card>
  );
};

export default TaxChannelsMenu;
