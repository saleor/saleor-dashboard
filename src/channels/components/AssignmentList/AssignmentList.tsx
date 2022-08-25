import { Accordion, Divider, Typography } from "@material-ui/core";
import Skeleton from "@saleor/components/Skeleton";
import { ReorderEvent } from "@saleor/types";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import AssignmentListFooter from "./AssignmentListFooter";
import AssignmentListHeader from "./AssignmentListHeader";
import Item from "./Item";
import SortableContainer from "./SortableContainer";
import { useExpanderStyles, useStyles } from "./styles";
import { AssignmentListProps } from "./types";

const messages = defineMessages({
  allSelectedMessage: {
    id: "uKlrEk",
    defaultMessage: "All available {itemsName} have been selected",
    description: "all selected items message",
  },
});

const AssignmentList: React.FC<AssignmentListProps> = props => {
  const {
    items,
    itemsName,
    totalCount = 0,
    loading,
    removeItem,
    reorderItem,
  } = props;

  const intl = useIntl();
  const classes = useStyles();
  const expanderClasses = useExpanderStyles();

  const handleSortStart = () => {
    document.body.classList.add(classes.grabbing);
  };

  const handleSortEnd = (event: ReorderEvent) => {
    document.body.classList.remove(classes.grabbing);
    reorderItem(event);
  };

  const hasMoreItemsToBeSelected = totalCount !== items.length;

  return (
    <Accordion classes={expanderClasses}>
      <AssignmentListHeader
        assignCount={items.length}
        itemsName={itemsName}
        loading={loading}
      />
      <Divider />
      {loading ? (
        <Skeleton className={classes.skeleton} />
      ) : (
        <>
          <SortableContainer
            axis="xy"
            lockAxis="xy"
            useDragHandle
            onSortStart={handleSortStart}
            onSortEnd={handleSortEnd}
          >
            <div>
              {items.map((item, itemIndex) => (
                <Item
                  key={itemIndex}
                  index={itemIndex}
                  item={item}
                  onDelete={removeItem}
                  sortable={!!reorderItem}
                />
              ))}
            </div>
          </SortableContainer>
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
        </>
      )}
    </Accordion>
  );
};
export default AssignmentList;
