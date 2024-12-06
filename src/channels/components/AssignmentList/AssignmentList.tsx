import { ReorderEvent } from "@dashboard/types";
import { Accordion, Divider, Skeleton, Text } from "@saleor/macaw-ui-next";
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
const AssignmentList = (props: AssignmentListProps) => {
  const { items, itemsName, totalCount = 0, loading, removeItem, reorderItem } = props;
  const intl = useIntl();
  const classes = useStyles();
  const handleSortStart = () => {
    document.body.classList.add(classes.grabbing);
  };
  const handleSortEnd = (event: ReorderEvent) => {
    document.body.classList.remove(classes.grabbing);

    if (reorderItem) {
      reorderItem(event);
    }
  };
  const hasMoreItemsToBeSelected = totalCount !== items.length;

  return (
    <Accordion paddingX={7} paddingBottom={2} paddingTop={4}>
      <Accordion.Item value="accordionItemId">
        <Accordion.Trigger paddingBottom={4}>
          {loading ? (
            <Skeleton />
          ) : (
            <Text fontSize={2} color="default2">
              {`${items.length} ${itemsName.toLowerCase()}`}
            </Text>
          )}
          <Accordion.TriggerButton dataTestId="expand-icon" />
        </Accordion.Trigger>

        <Accordion.Content>
          <Divider />
          {loading ? (
            <Skeleton className={classes.skeleton} />
          ) : (
            <>
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore */}
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
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
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
                <Text color="default2" fontSize={3} className={classes.infoMessage}>
                  {intl.formatMessage(messages.allSelectedMessage, {
                    itemsName: itemsName.toLowerCase(),
                  })}
                </Text>
              )}
            </>
          )}
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
};

export default AssignmentList;
