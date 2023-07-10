// @ts-strict-ignore
import Skeleton from "@dashboard/components/Skeleton";
import { ReorderEvent } from "@dashboard/types";
import { Typography } from "@material-ui/core";
import { Accordion, Divider } from "@saleor/macaw-ui/next";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import AssignmentListFooter from "./AssignmentListFooter";
import Item from "./Item";
import SortableContainer from "./SortableContainer";
import { useStyles } from "./styles";
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

  const handleSortStart = () => {
    document.body.classList.add(classes.grabbing);
  };

  const handleSortEnd = (event: ReorderEvent) => {
    document.body.classList.remove(classes.grabbing);
    reorderItem(event);
  };

  const hasMoreItemsToBeSelected = totalCount !== items.length;

  return (
    <Accordion paddingX={7} paddingBottom={2} paddingTop={4}>
      <Accordion.Item value="accordionItemId">
        <Accordion.Trigger paddingBottom={4}>
          {loading ? (
            <Skeleton />
          ) : (
            <Typography variant="subtitle2" color="textSecondary">
              {`${items.length} ${itemsName.toLowerCase()}`}
            </Typography>
          )}
          <Accordion.TriggerButton dataTestId="expand-icon" />
        </Accordion.Trigger>

        <Accordion.Content>
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
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
};
export default AssignmentList;
