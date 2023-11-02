import type { UniqueIdentifier } from "@dnd-kit/core";
import type { MutableRefObject, RefAttributes } from "react";

export interface TreeItem {
  id: UniqueIdentifier;
  children: TreeItem[];
}

export type TreeItems = TreeItem[];

export interface FlattenedItem extends TreeItem {
  parentId: UniqueIdentifier | null;
  depth: number;
  index: number;
}

export type SensorContext = MutableRefObject<{
  items: FlattenedItem[];
  offset: number;
}>;

export interface TreeItemComponentProps extends RefAttributes<HTMLDivElement> {
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
}
