import type { UniqueIdentifier } from "@dnd-kit/core";
import type { MutableRefObject } from "react";

export interface TreeItem<T> {
  id: UniqueIdentifier;
  data: T;
  children: Array<TreeItem<T>>;
}

export type TreeItems<T> = Array<TreeItem<T>>;

export interface FlattenedItem<T> extends TreeItem<T> {
  parentId: UniqueIdentifier | null;
  depth: number;
  index: number;
}

export type SensorContext<T> = MutableRefObject<{
  items: Array<FlattenedItem<T>>;
  offset: number;
}>;

export interface TreeItemComponentProps<T> {
  data: T;
  id: UniqueIdentifier;
  childCount?: number;
  clone?: boolean;
  depth: number;
  disableInteraction?: boolean;
  ghost?: boolean;
  handleProps?: any;
  indentationWidth: number;
  value: string | number;
  style?: React.CSSProperties;
  wrapperRef?: (node: HTMLDivElement) => void;
  innerRef?: (node: HTMLDivElement) => void;
}
