// @ts-strict-ignore

import { MenuTreeItem } from "@dashboard/navigation/types";
import { getPatch } from "fast-array-diff";

export type TreeOperationType = "move" | "remove";
export interface TreeOperation {
  id: string;
  type: TreeOperationType;
  parentId?: string;
  sortOrder?: number;
  simulatedMove?: boolean;
}

export function getDiff(originalTree: MenuTreeItem[], newTree: MenuTreeItem[]): TreeOperation[] {
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
        const sortOrder = removedNode ? addedNode.newPos - removedNode.oldPos : addedNode.newPos;

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
    return undefined;
  });

  return diff.filter(d => !!d);
}

function treeToMap(tree: MenuTreeItem[], parent: string): Record<string, string[]> {
  const childrenList = tree.map(node => node.id);
  const childrenMaps = tree.map(node => ({
    id: node.id,
    mappedNodes: treeToMap(node.children as MenuTreeItem[], node.id.toString()),
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
