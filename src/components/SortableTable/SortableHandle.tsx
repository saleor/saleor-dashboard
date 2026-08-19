import { DragHandle } from "@dashboard/components/DragHandle/DragHandle";
import { type DraggableAttributes, type DraggableSyntheticListeners } from "@dnd-kit/core";
import { TableCell } from "@material-ui/core";
import clsx from "clsx";
import { type MouseEvent, type PointerEvent } from "react";

import styles from "./SortableHandle.module.css";

interface SortableHandleProps {
  disabled?: boolean;
  isSorting?: boolean;
  attributes?: DraggableAttributes;
  listeners?: DraggableSyntheticListeners;
}

const stopRowNavigation = (event: MouseEvent<HTMLTableCellElement>): void => {
  event.stopPropagation();
};

const preventTextSelection = (
  event: PointerEvent<HTMLDivElement>,
  listeners: DraggableSyntheticListeners,
): void => {
  listeners?.onPointerDown?.(event);
  // Stops the browser from starting a native text selection as the pointer moves.
  event.preventDefault();
};

export const SortableHandle = ({
  disabled = false,
  isSorting = false,
  attributes,
  listeners,
}: SortableHandleProps): JSX.Element => (
  <TableCell className={clsx(styles.cell, disabled && styles.disabled)} onClick={stopRowNavigation}>
    <div
      className={styles.handle}
      {...(disabled ? undefined : attributes)}
      {...(disabled ? undefined : listeners)}
      onPointerDown={
        disabled
          ? undefined
          : (event: PointerEvent<HTMLDivElement>): void => preventTextSelection(event, listeners)
      }
    >
      <DragHandle
        cursor={disabled ? "not-allowed" : isSorting ? "grabbing" : "grab"}
        data-test-id="button-drag-handle"
      />
    </div>
  </TableCell>
);

SortableHandle.displayName = "SortableHandle";
