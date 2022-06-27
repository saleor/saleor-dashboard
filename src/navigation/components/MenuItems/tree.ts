import { MenuDetailsFragment } from "@saleor/graphql";
import { getPatch } from "fast-array-diff";
import { TreeItem } from "react-sortable-tree";

import { MenuItemType } from "../MenuItemDialog";

export type TreeOperationType = "move" | "remove";
export interface TreeOperation {
  id: string;
  type: TreeOperationType;
  parentId?: string;
  sortOrder?: number;
  simulatedMove?: boolean;
}

export const unknownTypeError = Error("Unknown type");

function treeToMap(tree: TreeItem[], parent: string): Record<string, string[]> {
  const childrenList = tree.map(node => node.id);
  const childrenMaps = tree.map(node => ({
    id: node.id,
    mappedNodes: treeToMap(node.children as TreeItem[], node.id),
  }));

  return {
    [parent]: childrenList,
    ...childrenMaps.reduce(
      (acc, childMap) => ({
        ...acc,
        ...childMap.mappedNodes,
      }),
      {},
    ),
  };
}

export function getItemType(
  item: MenuDetailsFragment["items"][0],
): MenuItemType {
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

export function getItemId(item: MenuDetailsFragment["items"][0]): string {
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

export function getDiff(
  originalTree: TreeItem[],
  newTree: TreeItem[],
): TreeOperation[] {
  const originalMap = treeToMap(originalTree, "root");
  const newMap = treeToMap(newTree, "root");

  const diff: TreeOperation[] = Object.keys(newMap).flatMap(key => {
    const originalNode = originalMap[key];
    const newNode = newMap[key];

    const patch = getPatch(originalNode, newNode);

    if (patch.length > 0) {
      const addedNode = patch.find(operation => operation.type === "add");
      const removedNode = patch.find(operation => operation.type === "remove");

      if (!!addedNode) {
        const changedParent = originalNode.length !== newNode.length;
        const sortOrder = removedNode
          ? addedNode.newPos - removedNode.oldPos
          : addedNode.newPos;

        // This exists because backend doesn't recongize the position of the new node
        // when it's moved from child to parent and/or up
        // We have to make an additional move so that backend can sort the new tree correctly
        // because without it the new node goes to the end of the parent node array by default
        // SimulatedMove is removed before submit
        if (changedParent && sortOrder !== originalNode.length) {
          return [
            {
              id: addedNode.items[0],
              parentId: key === "root" ? undefined : key,
              sortOrder: newNode.length - 1,
              type: "move" as TreeOperationType,
              simulatedMove: true,
            },
            {
              id: addedNode.items[0],
              parentId: key === "root" ? undefined : key,
              sortOrder:
                sortOrder - newNode.length < 0
                  ? sortOrder - newNode.length + 1
                  : sortOrder - newNode.length - 1,
              type: "move" as TreeOperationType,
            },
          ];
        }

        return {
          id: addedNode.items[0],
          parentId: key === "root" ? undefined : key,
          sortOrder,
          type: "move" as TreeOperationType,
        };
      }
    }
  });

  return diff.filter(d => !!d);
}

export function getNodeData(
  item: MenuDetailsFragment["items"][0],
  onChange: (operations: TreeOperation[]) => void,
  onClick: (id: string, type: MenuItemType) => void,
  onEdit: (id: string) => void,
): TreeItem {
  return {
    children: item.children.map(child =>
      getNodeData(child, onChange, onClick, onEdit),
    ),
    expanded: true,
    id: item.id,
    onChange,
    onClick: () => onClick(getItemId(item), getItemType(item)),
    onEdit: () => onEdit(item.id),
    title: item.name,
  };
}

export function getNodeQuantity(items: MenuDetailsFragment["items"]): number {
  return items.reduce(
    (acc, curr) => acc + getNodeQuantity(curr.children),
    items.length,
  );
}
