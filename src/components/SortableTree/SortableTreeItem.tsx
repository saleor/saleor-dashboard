import type { UniqueIdentifier } from "@dnd-kit/core";
import { AnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties } from "react";

import { DataTypePlaceholder, TreeItemComponentProps } from "./types";

interface SortableTreeItemProps<T extends DataTypePlaceholder> extends TreeItemComponentProps<T> {
  id: UniqueIdentifier;
  renderTreeItem: (props: TreeItemComponentProps<T>) => JSX.Element;
}

const animateLayoutChanges: AnimateLayoutChanges = ({ isSorting, wasDragging }) =>
  !(isSorting || wasDragging);

export function SortableTreeItem<T extends DataTypePlaceholder>({
  id,
  depth,
  renderTreeItem,
  data,
  ...props
}: SortableTreeItemProps<T>) {
  const {
    attributes,
    isDragging,
    isSorting,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    animateLayoutChanges,
  });
  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return renderTreeItem({
    id,
    data,
    innerRef: setDraggableNodeRef,
    wrapperRef: setDroppableNodeRef,
    style,
    depth,
    ghost: isDragging,
    disableInteraction: isSorting,
    handleProps: {
      ...attributes,
      ...listeners,
    },
    ...props,
  });
}
