import { type CategoryFragment } from "@dashboard/graphql";

export interface CategoryListCategoryRow {
  type: "category";
  category: CategoryFragment;
  depth: number;
  parentId: string | null;
}

export interface CategoryListLoadMoreRow {
  type: "load-more";
  parentId: string;
  depth: number;
  remainingCount: number;
}

export type CategoryListRow = CategoryListCategoryRow | CategoryListLoadMoreRow;

export const isCategoryListCategoryRow = (row: CategoryListRow): row is CategoryListCategoryRow =>
  row.type === "category";
