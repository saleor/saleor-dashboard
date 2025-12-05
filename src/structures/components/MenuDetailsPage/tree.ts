import { RecursiveMenuItem } from "@dashboard/structures/types";

import { TreeOperation } from "../MenuItems";

// Normalizes GraphQL menu items to ensure children is always an array

export function normalizeMenuItems(items: any): RecursiveMenuItem[] {
  if (!items) return [];

  return items.map(
    (item: any): RecursiveMenuItem => ({
      ...item,
      children: normalizeMenuItems(item.children),
    }),
  );
}

export function findNode(tree: RecursiveMenuItem[], id: string): (number | null)[] {
  const foundNodeIndex = tree.findIndex(node => node.id === id);

  if (tree.length === 0) {
    return [null];
  }

  if (foundNodeIndex !== -1) {
    return [foundNodeIndex];
  }

  const nodeMap = tree.map((node, nodeIndex) => [nodeIndex, ...findNode(node.children ?? [], id)]);

  return nodeMap.find(path => path[path.length - 1] !== null) || [null];
}

export function getNode(tree: RecursiveMenuItem[], path: (number | null)[]): RecursiveMenuItem {
  const index = path[0];

  if (index === null) {
    throw new Error("Cannot get node with null path");
  }

  if (path.length === 1) {
    return tree[index];
  }

  return getNode(tree[index].children ?? [], path.slice(1));
}

function removeNode(tree: RecursiveMenuItem[], path: (number | null)[]): RecursiveMenuItem[] {
  const removeIndex = path[0];

  if (removeIndex === null) {
    throw new Error("Cannot remove node with null path");
  }

  if (path.length === 1) {
    return [...tree.slice(0, removeIndex), ...tree.slice(removeIndex + 1)];
  }

  const newTree = [...tree];

  newTree[removeIndex] = {
    ...tree[removeIndex],
    children: removeNode(tree[removeIndex].children ?? [], path.slice(1)),
  };

  return newTree;
}

interface InsertNodeInput {
  tree: RecursiveMenuItem[];
  path: (number | null)[];
  node: RecursiveMenuItem;
  position: number;
}

function insertNode({ tree, path, node, position }: InsertNodeInput): RecursiveMenuItem[] {
  if (path.length === 0) {
    return [...tree.slice(0, position), node, ...tree.slice(position)];
  }

  const index = path[0];

  if (index === null) {
    throw new Error("Cannot insert node with null path");
  }

  if (index in tree) {
    tree[index].children = insertNode({
      tree: tree[index].children ?? [],
      path: path.slice(1),
      node,
      position,
    });
  }

  return tree;
}

function removeNodeAndChildren(
  tree: RecursiveMenuItem[],
  operation: TreeOperation,
): RecursiveMenuItem[] {
  const sourcePath = findNode(tree, operation.id);
  const node = getNode(tree, sourcePath);

  if (node?.children) {
    const treeAfterChildrenRemoval = node.children.reduce(
      (acc, child) =>
        removeNodeAndChildren(acc, {
          id: child.id,
          type: "remove",
        }),
      tree,
    );

    return removeNode(treeAfterChildrenRemoval, sourcePath);
  }

  return removeNode(tree, sourcePath);
}

function permuteRelativeNode(
  tree: RecursiveMenuItem[],
  permutation: TreeOperation,
): RecursiveMenuItem[] {
  const sourcePath = findNode(tree, permutation.id);
  const node = getNode(tree, sourcePath);
  const hasParent = !!permutation.parentId;
  const treeAfterRemoval = removeNode(tree, sourcePath);
  const targetPath = hasParent ? findNode(treeAfterRemoval, permutation.parentId ?? "") : [];
  const position = sourcePath[sourcePath.length - 1];

  if (position === null) {
    throw new Error("Cannot permute node with null position");
  }

  const treeAfterInsertion = insertNode({
    tree: treeAfterRemoval,
    path: targetPath,
    node,
    position: position + (permutation.sortOrder ?? 0),
  });

  return treeAfterInsertion;
}

function executeRelativeOperation(
  tree: RecursiveMenuItem[],
  operation: TreeOperation,
): RecursiveMenuItem[] {
  return operation.type === "move"
    ? permuteRelativeNode(tree, operation)
    : removeNodeAndChildren(tree, operation);
}

export function computeRelativeTree(
  tree: RecursiveMenuItem[],
  operations: TreeOperation[],
): RecursiveMenuItem[] {
  const newTree = operations.reduce(
    (acc, operation) => executeRelativeOperation(acc, operation),
    JSON.parse(JSON.stringify(tree)),
  );

  return newTree;
}
