import DeletableItem from "@dashboard/components/DeletableItem";
import { Divider, Text } from "@saleor/macaw-ui-next";
import { Link as RouterLink } from "react-router-dom";
import { SortableElement, type SortableElementProps } from "react-sortable-hoc";

import SortableHandle from "./SortableHandle";
import { useStyles } from "./styles";
import { type AssignItem } from "./types";

interface ItemProps extends SortableElementProps {
  item: AssignItem;
  sortable?: boolean;
  onDelete: (id: string) => void;
  getItemHref?: (item: AssignItem) => string | undefined;
}

/** @deprecated This component should use @dnd-kit instead of react-sortable-hoc */
const Item = SortableElement(({ item, sortable = false, onDelete, getItemHref }: ItemProps) => {
  const { id, name } = item;
  const classes = useStyles();
  const href = getItemHref?.(item);

  return (
    <>
      <div className={classes.container}>
        <div className={classes.containerContent}>
          {sortable && (
            // @ts-expect-error - legacy types
            <SortableHandle className={classes.sortableHandle} data-test-id="button-drag-handle" />
          )}
          {href ? (
            <RouterLink to={href} className={classes.itemLink} data-test-id={`${id}-link`}>
              <Text size={3} textDecoration={{ hover: "underline" }}>
                {name}
              </Text>
            </RouterLink>
          ) : (
            <Text size={3}>{name}</Text>
          )}
        </div>
        <DeletableItem id={id} onDelete={onDelete} />
      </div>
      <Divider />
    </>
  );
});

export default Item;
