import {
  type DraggableAttributes,
  type DraggableSyntheticListeners,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { type AnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { type CSSProperties } from "react";

import TableRowLink, { type TableRowLinkProps } from "../TableRowLink";
import { SortableHandle } from "./SortableHandle";
import styles from "./SortableTableRow.module.css";
import { useSortableContext } from "./sortableTableState";

export type SortableTableRowProps = TableRowLinkProps & {
  id?: UniqueIdentifier;
  /** Fallback sortable id when `id` is omitted (stories / legacy callers). */
  index?: number;
  /** Floating clone for DragOverlay — no sortable sensors. */
  overlay?: boolean;
};

type SortableTableRowViewProps = SortableTableRowProps & {
  attributes?: DraggableAttributes;
  isPlaceholder?: boolean;
  listeners?: DraggableSyntheticListeners;
  rowStyle?: CSSProperties;
  setRowNodeRef?: (node: HTMLTableRowElement | null) => void;
};

type SortableRowCssVars = CSSProperties & {
  "--sortable-transform": string;
};

/** Skip post-drop FLIP — it looks like rows falling from the old index. */
const skipLayoutAnimation: AnimateLayoutChanges = () => false;

const SortableTableRowView = ({
  attributes,
  children,
  className,
  id,
  index,
  isPlaceholder = false,
  listeners,
  overlay = false,
  rowStyle,
  setRowNodeRef,
  style,
  ...props
}: SortableTableRowViewProps): JSX.Element => {
  const { disabled, isSorting } = useSortableContext();

  return (
    <TableRowLink
      ref={setRowNodeRef}
      data-sortable-id={id ?? index}
      className={clsx(
        className,
        styles.row,
        isSorting && styles.sorting,
        isPlaceholder && styles.placeholder,
      )}
      style={{ ...style, ...rowStyle }}
      {...props}
    >
      <SortableHandle
        disabled={disabled || overlay}
        isSorting={overlay || isPlaceholder}
        attributes={overlay ? undefined : attributes}
        listeners={overlay ? undefined : listeners}
      />
      {children}
    </TableRowLink>
  );
};

const SortableTableRowDnd = (props: SortableTableRowProps): JSX.Element => {
  const { disabled } = useSortableContext();
  const sortableId = props.id ?? props.index;

  if (sortableId == null) {
    throw new Error("SortableTableRow requires `id` or `index`.");
  }

  const { attributes, listeners, setNodeRef, isDragging, transform } = useSortable({
    id: sortableId,
    disabled,
    animateLayoutChanges: skipLayoutAnimation,
  });
  const setRowNodeRef = (node: HTMLTableRowElement | null): void => {
    setNodeRef(node);
  };
  const rowStyle: SortableRowCssVars = {
    "--sortable-transform": CSS.Translate.toString(transform) ?? "none",
  };

  return (
    <SortableTableRowView
      {...props}
      attributes={attributes}
      isPlaceholder={isDragging}
      listeners={listeners}
      setRowNodeRef={setRowNodeRef}
      rowStyle={rowStyle}
    />
  );
};

export const SortableTableRow = ({ overlay, ...props }: SortableTableRowProps): JSX.Element => {
  if (overlay) {
    return <SortableTableRowView {...props} overlay />;
  }

  return <SortableTableRowDnd {...props} />;
};

SortableTableRow.displayName = "SortableTableRow";
