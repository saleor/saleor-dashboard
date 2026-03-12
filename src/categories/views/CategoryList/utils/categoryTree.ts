import { type CategoryFragment } from "@dashboard/graphql";

import { type CategoryListRow } from "../types";

export const collectDescendantIds = (
  parentId: string,
  getChildren: (parentId: string) => CategoryFragment[],
): string[] => {
  const children = getChildren(parentId);

  return children.flatMap(child => [child.id, ...collectDescendantIds(child.id, getChildren)]);
};

export const buildVisibleRows = (
  roots: CategoryFragment[],
  expandedIds: Set<string>,
  getChildren: (parentId: string) => CategoryFragment[],
): CategoryListRow[] => {
  const rows: CategoryListRow[] = [];

  const appendRows = (nodes: CategoryFragment[], depth: number, parentId: string | null): void => {
    nodes.forEach(node => {
      rows.push({ category: node, depth, parentId });

      if (expandedIds.has(node.id)) {
        appendRows(getChildren(node.id), depth + 1, node.id);
      }
    });
  };

  appendRows(roots, 0, null);

  return rows;
};

export const buildDepthByCategoryId = (rows: CategoryListRow[]): Record<string, number> =>
  rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.category.id] = row.depth;

    return acc;
  }, {});

export const buildParentByCategoryId = (rows: CategoryListRow[]): Record<string, string | null> =>
  rows.reduce<Record<string, string | null>>((acc, row) => {
    acc[row.category.id] = row.parentId;

    return acc;
  }, {});
