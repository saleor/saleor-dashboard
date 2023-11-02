// @ts-strict-ignore
import { TreeItem } from "@dashboard/components/SortableTree/types";
import { RecursiveMenuItem } from "@dashboard/navigation/types";

import { MenuItemType } from "../MenuItemDialog";

export type TreeOperationType = "move" | "remove";
export interface TreeOperation {
  id: string;
  type: TreeOperationType;
  parentId?: string;
  sortOrder?: number;
  simulatedMove?: boolean;
}
export interface TreeItemProps {
  id: string;
  onChange?: (operations: TreeOperation[]) => void;
  onClick?: () => void;
  onEdit?: () => void;
}

export type MenuTreeItem = TreeItem<RecursiveMenuItem>;

export const unknownTypeError = Error("Unknown type");

export function getItemType(item: RecursiveMenuItem): MenuItemType {
  if (item.category) {
    return "category";
  } else if (item.collection) {
    return "collection";
  } else if (item.page) {
    return "page";
  } else if (item.url) {
    return "link";
  } else {
    throw unknownTypeError;
  }
}

export function getItemId(item: RecursiveMenuItem): string {
  if (item.category) {
    return item.category.id;
  } else if (item.collection) {
    return item.collection.id;
  } else if (item.page) {
    return item.page.id;
  } else if (item.url) {
    return item.url;
  } else {
    throw unknownTypeError;
  }
}

export function getNodeData(item: RecursiveMenuItem): MenuTreeItem {
  return {
    children: item.children.map(child => getNodeData(child)),
    data: item,
    id: item.id,
  };
}

export function getNodeQuantity(items: RecursiveMenuItem[]): number {
  return items.reduce(
    (acc, curr) => acc + getNodeQuantity(curr.children),
    items.length,
  );
}
