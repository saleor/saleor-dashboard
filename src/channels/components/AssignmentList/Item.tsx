import { Divider, Typography } from "@material-ui/core";
import DeletableItem from "@saleor/components/DeletableItem";
import React from "react";
import { SortableElement, SortableElementProps } from "react-sortable-hoc";

import SortableHandle from "./SortableHandle";
import { useStyles } from "./styles";
import { AssignItem } from "./types";

interface ItemProps extends SortableElementProps {
  item: AssignItem;
  sortable?: boolean;
  onDelete: (id: string) => void;
}

const Item = SortableElement(
  ({ item, sortable = false, onDelete }: ItemProps) => {
    const { id, name } = item;
    const classes = useStyles();

    return (
      <>
        <div className={classes.container}>
          <div className={classes.containerContent}>
            {sortable && (
              <SortableHandle
                className={classes.sortableHandle}
                data-test-id="button-drag-handle"
              />
            )}
            <Typography>{name}</Typography>
          </div>
          <DeletableItem id={id} onDelete={onDelete} />
        </div>
        <Divider />
      </>
    );
  },
);

export default Item;
