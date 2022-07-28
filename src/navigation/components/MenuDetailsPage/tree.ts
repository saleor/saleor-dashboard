import { MenuDetailsFragment } from "@saleor/graphql";

import { TreeOperation } from "../MenuItems";

export function findNode(
  tree: MenuDetailsFragment["items"],
  id: string,
): number[] {
  const foundNodeIndex = tree.findIndex(node => node.id === id);
  if (tree.length === 0) {
    return [null];
  }
  if (foundNodeIndex !== -1) {
    return [foundNodeIndex];
  }
  const nodeMap = tree.map((node, nodeIndex) => [
    nodeIndex,
    ...findNode(node.children, id),
  ]);
  return nodeMap.find(path => path[path.length - 1] !== null) || [null];
}

export function getNode(
  tree: MenuDetailsFragment["items"],
  path: number[],
): MenuDetailsFragment["items"][0] {
  if (path.length === 1) {
    return tree[path[0]];
  }
  return getNode([...tree[path[0]].children], path.slice(1));
}

function removeNode(
  tree: MenuDetailsFragment["items"],
  path: number[],
): MenuDetailsFragment["items"] {
  const removeIndex = path[0];

  if (path.length === 1) {
    return [...tree.slice(0, removeIndex), ...tree.slice(removeIndex + 1)];
  }

  const newTree = [...tree];
  newTree[removeIndex] = {
    ...tree[path[0]],
    children: removeNode(tree[path[0]].children, path.slice(1)),
  };

  return newTree;
}

interface InsertNodeInput {
  tree: MenuDetailsFragment["items"];
  path: number[];
  node: MenuDetailsFragment["items"][0];
  position: number;
}

function insertNode({
  tree,
  path,
  node,
  position,
}: InsertNodeInput): MenuDetailsFragment["items"] {
  if (path.length === 0) {
    return [...tree.slice(0, position), node, ...tree.slice(position)];
  }

  if (path[0] in tree) {
    tree[path[0]].children = insertNode({
      tree: tree[path[0]].children,
      path: path.slice(1),
      node,
      position,
    });
  }
  return tree;
}

function removeNodeAndChildren(
  tree: MenuDetailsFragment["items"],
  operation: TreeOperation,
): MenuDetailsFragment["items"] {
  const sourcePath = findNode(tree, operation.id);
  const node = getNode(tree, sourcePath);

  if (node.children) {
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
  tree: MenuDetailsFragment["items"],
  permutation: TreeOperation,
): MenuDetailsFragment["items"] {
  const sourcePath = findNode(tree, permutation.id);
  const node = getNode(tree, sourcePath);

  const hasParent = !!permutation.parentId;

  const treeAfterRemoval = removeNode(tree, sourcePath);

  const targetPath = hasParent
    ? findNode(treeAfterRemoval, permutation.parentId)
    : [];

  const position = sourcePath[sourcePath.length - 1];

  const treeAfterInsertion = insertNode({
    tree: treeAfterRemoval,
    path: targetPath,
    node,
    position: position + permutation.sortOrder,
  });

  return treeAfterInsertion;
}

function executeRelativeOperation(
  tree: MenuDetailsFragment["items"],
  operation: TreeOperation,
): MenuDetailsFragment["items"] {
  return operation.type === "move"
    ? permuteRelativeNode(tree, operation)
    : removeNodeAndChildren(tree, operation);
}

export function computeRelativeTree(
  tree: MenuDetailsFragment["items"],
  operations: TreeOperation[],
) {
  const newTree = operations.reduce(
    (acc, operation) => executeRelativeOperation(acc, operation),
    JSON.parse(JSON.stringify(tree)),
  );
  return newTree;
}
