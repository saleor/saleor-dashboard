import { type CategoryFragment } from "@dashboard/graphql";

import {
  type CategoryListCategoryRow,
  type CategoryListLoadMoreRow,
  type CategoryListRow,
} from "../types";

export const collectDescendantIds = (
  parentId: string,
  getChildren: (parentId: string) => CategoryFragment[],
): string[] => {
  const children = getChildren(parentId);

  return children.flatMap(child => [child.id, ...collectDescendantIds(child.id, getChildren)]);
};

interface BuildVisibleRowsOptions {
  hasMoreChildren?: (parentId: string) => boolean;
  getRemainingChildrenCount?: (parentId: string, parentCategory: CategoryFragment) => number;
}

export const buildVisibleRows = (
  roots: CategoryFragment[],
  expandedIds: Set<string>,
  getChildren: (parentId: string) => CategoryFragment[],
  { hasMoreChildren, getRemainingChildrenCount }: BuildVisibleRowsOptions = {},
): CategoryListRow[] => {
  const rows: CategoryListRow[] = [];

  const appendRows = (nodes: CategoryFragment[], depth: number, parentId: string | null): void => {
    nodes.forEach(node => {
      const categoryRow: CategoryListCategoryRow = {
        type: "category",
        category: node,
        depth,
        parentId,
      };

      rows.push(categoryRow);

      if (!expandedIds.has(node.id)) {
        return;
      }

      const children = getChildren(node.id);

      appendRows(children, depth + 1, node.id);

      if (hasMoreChildren?.(node.id)) {
        const loadMoreRow: CategoryListLoadMoreRow = {
          type: "load-more",
          parentId: node.id,
          depth: depth + 1,
          remainingCount: getRemainingChildrenCount?.(node.id, node) ?? 0,
        };

        rows.push(loadMoreRow);
      }
    });
  };

  appendRows(roots, 0, null);

  return rows;
};

export const buildDepthByCategoryId = (rows: CategoryListRow[]): Record<string, number> =>
  rows.reduce<Record<string, number>>((acc, row) => {
    if (row.type === "category") {
      acc[row.category.id] = row.depth;
    }

    return acc;
  }, {});

export const buildParentByCategoryId = (rows: CategoryListRow[]): Record<string, string | null> =>
  rows.reduce<Record<string, string | null>>((acc, row) => {
    if (row.type === "category") {
      acc[row.category.id] = row.parentId;
    }

    return acc;
  }, {});
