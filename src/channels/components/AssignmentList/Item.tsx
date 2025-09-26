import DeletableItem from "@dashboard/components/DeletableItem";
import { Divider, Text } from "@saleor/macaw-ui-next";
import { SortableElement, SortableElementProps } from "react-sortable-hoc";

import SortableHandle from "./SortableHandle";
import { useStyles } from "./styles";
import { AssignItem } from "./types";

interface ItemProps extends SortableElementProps {
  item: AssignItem;
  sortable?: boolean;
  onDelete: (id: string) => void;
}

/** @deprecated This component should use @dnd-kit instead of react-sortable-hoc */
const Item = SortableElement(({ item, sortable = false, onDelete }: ItemProps) => {
  const { id, name } = item;
  const classes = useStyles();

  return (
    <>
      <div className={classes.container}>
        <div className={classes.containerContent}>
          {sortable && (
            // @ts-expect-error - legacy types
            <SortableHandle className={classes.sortableHandle} data-test-id="button-drag-handle" />
          )}
          <Text size={3}>{name}</Text>
        </div>
        <DeletableItem id={id} onDelete={onDelete} />
      </div>
      <Divider />
    </>
  );
});

export default Item;
