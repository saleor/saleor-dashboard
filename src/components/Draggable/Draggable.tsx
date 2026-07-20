import { type DraggableAttributes } from "@dnd-kit/core";
import { type AnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type * as React from "react";

type DraggableRenderProps = {
  ref: (node: HTMLElement | null) => void;
  style: React.CSSProperties;
  isDragging: boolean;
} & DraggableAttributes;

interface DraggableProps {
  id: string;
  children: (props: DraggableRenderProps) => React.ReactElement;
  disabled?: boolean;
}

/** Skip post-drop layout tween — flex/grid reflows look like a slide from the left. */
const animateLayoutChanges: AnimateLayoutChanges = () => false;

/** This element is used as wrapper in @dnd-kit sortable list
 * in order to make children element interactive */
export const Draggable = ({ id, children, disabled }: DraggableProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
    animateLayoutChanges,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    // Only keep the live-drag transition; never animate into the post-drop layout
    transition: isDragging ? transition : undefined,
  };

  return children({
    ref: setNodeRef,
    style,
    isDragging,
    ...attributes,
    ...listeners,
  });
};
