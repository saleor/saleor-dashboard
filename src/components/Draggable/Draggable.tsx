import { DraggableAttributes } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

export type DraggableRenderProps = {
  ref: (node: HTMLElement | null) => void;
  style: React.CSSProperties;
  isDragging: boolean;
} & DraggableAttributes;

interface DraggableProps {
  id: string;
  children: (props: DraggableRenderProps) => React.ReactElement;
}

/** This element is used as wrapper in @dnd-kit sortable list
 * in order to make children element interactive */
export const Draggable = ({ id, children }: DraggableProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  } as React.CSSProperties;

  return children({
    ref: setNodeRef,
    style,
    isDragging,
    ...attributes,
    ...listeners,
  });
};
