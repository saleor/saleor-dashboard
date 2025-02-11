import ListItemLink from "@dashboard/components/ListItemLink";
import { TaxConfigurationFragment } from "@dashboard/graphql";
import { taxesMessages } from "@dashboard/taxes/messages";
import { taxConfigurationListUrl } from "@dashboard/taxes/urls";
import { isLastElement } from "@dashboard/taxes/utils/utils";
import { Card, Divider } from "@material-ui/core";
import { List, ListHeader, ListItem, ListItemCell } from "@saleor/macaw-ui";
import { Skeleton } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Fragment } from "react";
import { FormattedMessage } from "react-intl";

import { useStyles } from "./styles";

interface TaxChannelsMenuProps {
  configurations: TaxConfigurationFragment[] | undefined;
  selectedConfigurationId: string;
}

export const TaxChannelsMenu = ({
  configurations,
  selectedConfigurationId,
}: TaxChannelsMenuProps) => {
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
          <Fragment key={configuration.id}>
            <ListItemLink
              data-test-id="channels-list-rows"
              className={clsx(classes.clickable, classes.tableRow, {
                [classes.selected]: configuration.id === selectedConfigurationId,
              })}
              href={taxConfigurationListUrl(configuration.id)}
            >
              <ListItemCell className={classes.ellipsis}>{configuration.channel.name}</ListItemCell>
            </ListItemLink>
            {!isLastElement(configurations, confIndex) && <Divider />}
          </Fragment>
        )) ?? <Skeleton />}
      </List>
    </Card>
  );
};

export default TaxChannelsMenu;
