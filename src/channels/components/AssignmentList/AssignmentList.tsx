import { Accordion, Divider, Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import AssignmentListFooter from "./AssignmentListFooter";
import AssignmentListHeader from "./AssignmentListHeader";
import Item from "./Item";
import { useExpanderStyles } from "./styles";
import { AssignmentListProps } from "./types";

const messages = defineMessages({
  allSelectedMessage: {
    id: "uKlrEk",
    defaultMessage: "All available {itemsName} have been selected",
    description: "all selected items message",
  },
});

const useStyles = makeStyles(
  theme => ({
    infoMessage: {
      padding: theme.spacing(3),
    },
  }),
  { name: "AssignmentList" },
);

const AssignmentList: React.FC<AssignmentListProps> = props => {
  const {
    items,
    itemsName,
    fetchMoreItems: { totalCount },
    removeItem,
  } = props;

  const intl = useIntl();
  const classes = useStyles();
  const expanderClasses = useExpanderStyles();

  const hasMoreItemsToBeSelected = totalCount !== items.length;

  return (
    <Accordion classes={expanderClasses}>
      <AssignmentListHeader
        assignCount={items.length}
        totalCount={totalCount}
        itemsName={itemsName}
      />
      <Divider />
      {items.map(item => (
        <Item key={item.id} item={item} onDelete={removeItem} />
      ))}
      {hasMoreItemsToBeSelected ? (
        <AssignmentListFooter {...props} />
      ) : (
        <Typography
          color="textSecondary"
          variant="subtitle1"
          className={classes.infoMessage}
        >
          {intl.formatMessage(messages.allSelectedMessage, {
            itemsName: itemsName.toLowerCase(),
          })}
        </Typography>
      )}
    </Accordion>
  );
};
export default AssignmentList;
