import { type CategoryFragment } from "@dashboard/graphql";

export interface CategoryListRow {
  category: CategoryFragment;
  depth: number;
  parentId: string | null;
}
